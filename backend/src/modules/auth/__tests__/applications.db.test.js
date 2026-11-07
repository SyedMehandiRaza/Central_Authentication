import { cleanTables, closeDb, dbError, query } from '../../../test/db.js';
import { applicationValues, insertApplication, sha256Hex } from '../../../test/factories.js';

beforeEach(cleanTables);
afterAll(closeDb);

describe('applications table', () => {
  test('stores an application with ACTIVE status and no client secret by default', async () => {
    const id = await insertApplication({ code: 'fyinder', name: 'Fyinder' });

    const [row] = await query('SELECT * FROM applications WHERE id = ?', [id]);
    expect(row).toMatchObject({ code: 'fyinder', name: 'Fyinder', status: 'ACTIVE' });
    expect(row.client_secret_hash).toBeNull();
    expect(row.created_at).toBeInstanceOf(Date);
    expect(row.updated_at).toBeInstanceOf(Date);
  });

  test('rejects a duplicate code', async () => {
    await insertApplication({ code: 'fyinder' });

    const error = await dbError(() => insertApplication({ code: 'fyinder' }));
    expect(error.code).toBe('ER_DUP_ENTRY');
    expect(error.sqlMessage).toContain('uq_applications_code');
  });

  test('rejects a status outside the enum', async () => {
    const error = await dbError(() => insertApplication({ status: 'DELETED' }));
    expect(error.code).toBe('WARN_DATA_TRUNCATED');
  });

  test.each([['Fyinder'], ['real-estate'], ['1app'], ['']])(
    'rejects the code %p (lower snake case only)',
    async (code) => {
      const error = await dbError(() => insertApplication({ code }));
      expect(error.code).toBe('ER_CHECK_CONSTRAINT_VIOLATED');
      expect(error.sqlMessage).toContain('chk_applications_code_format');
    },
  );

  test('accepts a 64-character lowercase hex client secret hash and rejects anything else', async () => {
    await insertApplication({ client_secret_hash: sha256Hex('secret') });

    const error = await dbError(() =>
      insertApplication({ client_secret_hash: 'NOT-A-HASH'.padEnd(64, 'x') }),
    );
    expect(error.code).toBe('ER_CHECK_CONSTRAINT_VIOLATED');
    expect(error.sqlMessage).toContain('chk_applications_client_secret_hash_format');
  });

  test('requires a name', async () => {
    const values = applicationValues();
    delete values.name;
    const error = await dbError(() =>
      query('INSERT INTO applications (code) VALUES (?)', [values.code]),
    );
    expect(error.code).toBe('ER_NO_DEFAULT_FOR_FIELD');
  });
});
