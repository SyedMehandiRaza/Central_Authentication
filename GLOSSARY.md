# Central Authentication

The one place where a person's login identity lives, and which application panels each person may enter. Every connected application keeps its own profiles and business data.

## Identity

**Person**:
One human being, known by one email address and one password, across every connected application. Stored as a user.
_Avoid_: account, member, customer

**Person id**:
The public, non-guessable identifier of a person that applications store to link their own records to the person.
_Avoid_: user id (internal number), external id

**Email verification**:
Proof that a person controls their email address, given by entering a one-time code sent to it.
_Avoid_: activation, confirmation

**One-time code**:
A short numeric code sent by email for a single purpose (email verification, password reset or account setup), valid for a short time and a limited number of tries.
_Avoid_: OTP token, PIN

**Invited person**:
A person created by an application or an administrator who has not set a password yet.
_Avoid_: shadow user, placeholder account

**Profile version**:
A counter that goes up every time a person's name or email changes, so applications can tell an old copy of those details from a newer one.

## Access

**Application**:
A separate product that relies on this service for login, such as fyinder or real_estate.
_Avoid_: client, tenant, app (in formal text)

**Panel**:
One area of an application meant for one kind of person, such as the fyinder Seeker panel or the real_estate Buyer panel.
_Avoid_: role (this service does not hold fine-grained permissions), portal, dashboard

**Panel access**:
The permission for one person to enter one panel. A person can hold panel access to many panels in many applications.
_Avoid_: role assignment, membership

**Open panel**:
A panel a person may join by signing up themselves.
_Avoid_: public panel

**Invite-only panel**:
A panel a person can only enter after an application or an administrator grants access.
_Avoid_: private panel, restricted panel

**Session**:
One login of a person into one application, which lasts until logout, expiry or revocation.
_Avoid_: login (as a noun), device

**Security event**:
A recorded fact about something security-relevant that happened to a person or an application, such as a failed login.
_Avoid_: audit log entry, activity
