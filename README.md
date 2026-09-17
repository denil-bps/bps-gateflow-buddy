# BPS Gate Guardian

Build a working full-stack web application called BPS GateFlow for the Golden Gate of Birla Public School, Pilani.

The school currently uses physical gate registers. GateFlow will digitize ONLY the Student and Visitor gate processes for the first version. The physical registers will continue to be used.

Keep the project simple, fast and functional. Prioritize completing the core features instead of adding unnecessary features.

1. USERS

Create ONLY TWO online user roles:

ADMIN

Full access to student data, visitor records, gate records, dashboard, reports, settings and user management.

GATE SYSTEM

One shared account for the security gate.

Gate System can operate the gate, but cannot access admin settings, manage users, change permissions or delete historical records.

Students, parents, visitors, staff and workers do NOT have accounts.

2. STUDENT SYSTEM

Students already have school ID cards with unique QR codes.

When the guard scans the student's QR code using the webcam, fetch the student's information automatically.

Student data:

Student ID

Name

Class

Section

House

House No.

Photo

QR ID

Current Status

BPS Houses

Senior Secondary:

Panini

Patanjali

Katyayan

Vyas

Kanad

Middle & Junior Secondary:

Gurunanak

Mahavir

Buddha

Dayanand

Vivekanand

House No. / Student Number

The school's student number format is:

BPSST50 + 5-digit admission number

Example:

Admission number: 12455

House/Student number:

BPSST5012455

Store this as the student's House No./unique school number where applicable.

3. STUDENT OUT

The school already issues physical gate passes through the houses.

At the Golden Gate, the guard:

Scans student QR

System fetches student

Guard enters the physical Gate Pass Number

Enters Vehicle No.

Enters Going With Whom

Selects Movement Type

Enters Purpose/Reason

Confirms OUT

Student OUT fields:

S. No. — automatic

Gate Pass No.

Student Name — automatic

House — automatic

House No. — automatic

Date/Time OUT — automatic server timestamp

Vehicle No.

Going With Whom

Movement Type

Purpose/Reason

Movement Type options:

Personal Leave

On Duty

Medical

Home Leave

Outing

Other

On Duty must be included because students may leave for school activities, competitions, trips, events and other official school work.

Do not create a separate On Duty system. It is simply a movement type.

The guard must never manually type the OUT timestamp.

4. STUDENT IN

When the student returns:

Scan the same student QR

System identifies that the student is currently OUTSIDE

Show the active gate-pass/movement

Guard checks the information

Guard enters "Who Dropped"

Clicks MARK IN

System automatically records Date/Time IN

Student status becomes ON CAMPUS

Do not create unrelated separate IN records.

The system should connect:

OUT → IN

as one completed movement transaction.

Prevent duplicate OUT when already outside and duplicate IN when already on campus, except for an Admin override.

5. VISITOR SYSTEM

Visitors and parents do not have permanent school QR codes.

The guard selects:

NEW VISITOR

Create a Visitor Group.

The Visitor Group contains:

Visitor Pass ID

Head Visitor Name

Email

Phone

Accompanying Visitor Names

Date/Time IN — automatic

Vehicle No.

Whom to Meet

Purpose/Reason

Status

One Head Visitor can have multiple accompanying people.

Example:

Head Visitor:
Rahul Sharma

Accompanying:

Priya Sharma

Arjun Sharma

Kavya Sharma

Treat this as one Visitor Group with one temporary Visitor Pass/QR.

Generate a temporary Visitor Pass ID and QR.

6. VISITOR OUT

At exit:

Scan or search Visitor Pass

Show the Visitor Group

Confirm OUT

Automatically record Date/Time OUT

Mark the visitor group as completed/outside

7. SECOND MONITOR / PUBLIC DISPLAY

The system will run on ONE PC with:

Monitor 1 — Guard screen

Monitor 2 — Public screen

One webcam

Keyboard

Mouse

Printer

UPS

Add a clearly visible button in the main Gate System interface:

OPEN PUBLIC DISPLAY

When clicked, open the Public Display in a new browser window so the guard can move that window to Monitor 2.

The Public Display must be completely read-only and must not require another login.

It should receive live updates from the main Gate System screen/database.

Whenever the guard selects a page, scans a QR, types visitor information or completes an action, the public display should update appropriately.

The public display should look extremely polished and welcoming, like a professional reception/gate display.

Use the heading:

WELCOME TO BIRLA PUBLIC SCHOOL, PILANI

with a premium, clean school interface.

8. PUBLIC DISPLAY — IDLE STATE

When nothing is happening, show:

WELCOME TO
BIRLA PUBLIC SCHOOL, PILANI

GOLDEN GATE

A clean instruction such as:

Please proceed to the security desk for entry or exit.

Keep this screen attractive but not overloaded.

9. PUBLIC DISPLAY — STUDENT ENTRY/EXIT

When the guard selects the Student process, the public screen should dynamically change.

For a student entry/scan screen:

WELCOME TO BIRLA PUBLIC SCHOOL, PILANI

STUDENT ENTRY

Please scan your school ID QR code

Show a clear QR scanning instruction/visual.

After the guard scans the student's QR, show a safe confirmation screen.

Do not show private information such as phone numbers, guardian information or other sensitive data.

For example:

STUDENT IDENTIFIED ✓

Denil Kanetiya

Please wait while your gate entry is processed.

After successful OUT:

GATE EXIT RECORDED ✓

Have a safe journey!

After successful IN:

WELCOME BACK ✓

Welcome to our school campus.

The exact wording can be refined by the UI design, but the system should provide different messages for:

Student OUT

Student IN

Visitor IN

Visitor OUT

Access denied

Invalid QR

Invalid/expired gate pass

10. PUBLIC DISPLAY — VISITOR

When the guard selects:

NEW VISITOR

the public display should automatically show:

WELCOME TO BIRLA PUBLIC SCHOOL, PILANI

VISITOR REGISTRATION

Please provide your details at the security desk.

As the guard enters visitor information, the public screen can update with appropriate non-sensitive information.

Do NOT display:

Phone number

Email

Personal address

Sensitive information

After successful visitor entry:

VISITOR ENTRY RECORDED ✓

Welcome to our school campus.

At visitor exit:

VISIT RECORDED ✓

Thank you for visiting Birla Public School, Pilani.
We hope to see you again.

11. PUBLIC DISPLAY — LIVE BEHAVIOR

The public screen should work as a live companion to the Guard Screen.

Example:

Guard clicks Student → Public Display shows Student Entry.

Guard scans QR → Public Display shows:

QR CODE SCANNED ✓

Guard processes OUT → Public Display shows:

EXIT RECORDED ✓

Guard processes IN → Public Display shows:

WELCOME BACK ✓

Guard selects Visitor → Public Display shows:

PLEASE PROVIDE YOUR DETAILS

Guard completes registration → Public Display shows:

WELCOME TO OUR SCHOOL CAMPUS ✓

After a short period, automatically return to the idle Welcome screen.

The public display should feel smooth and professional.

12. PRINTING

Use the existing school printer.

Generate compact bill/receipt-style printable passes.

Approximate pass size:

4 × 3 inches

Student/Visitor pass should include relevant information such as:

Birla Public School, Pilani

Golden Gate

Pass Number

Name

Movement/Visitor details

Date/Time

Expected Return where applicable

QR code

"Scan at Golden Gate"

Also create an A4 batch-print layout with multiple small passes per A4 sheet and clean cutting margins.

13. ADMIN DASHBOARD

Create a clean dashboard showing:

Students ON CAMPUS

Students OUTSIDE

Today's Student OUT

Today's Student IN

Current Visitors

Today's Visitor IN

Today's Visitor OUT

Active Gate Passes

Overdue expected returns

Recent Gate Activity

Admin can:

Import students using CSV/Excel

Add/edit students

Manage QR IDs

Block/unblock QR IDs

Search students

View student movement history

View visitor history

View/reprint passes

Manage Gate System access

Student import fields:

Student ID, Name, Class, Section, House, House No., QR ID

14. SECURITY

Use proper authentication and role-based access.

Student QR codes and Visitor QR codes should contain only secure identifiers, not personal information.

Use server/database timestamps for all IN and OUT times.

Important actions should be recorded in an audit log.

Gate System cannot delete historical records.

Do not expose sensitive visitor/student information on the Public Display.

15. DATABASE

For this MVP, use Lovable's own database/backend if it is suitable.

Keep the database structure clean and extensible.

Core entities:

Users

Students

Student QR IDs

Gate Passes

Student Movements

Visitor Groups

Visitor Passes

Audit Logs

Do NOT build Parcel, Goods or Staff modules now, but keep the architecture extendable for those modules later.

16. MAIN GUARD WORKFLOW

Keep the guard experience extremely simple.

Student:

SCAN QR → FETCH STUDENT → ENTER GATE PASS DETAILS → CONFIRM OUT → PRINT

Return:

SCAN QR → SHOW ACTIVE MOVEMENT → CONFIRM IN → AUTOMATIC TIMESTAMP

Visitor:

NEW VISITOR → ENTER DETAILS → ADD ACCOMPANYING PEOPLE → GENERATE PASS/QR → PRINT → EXIT BY SCAN

The system should prioritize speed and minimum typing for security guards.

17. DESIGN

Create a professional, modern school security-management interface.

Guard interface:

Simple

Fast

Clear buttons

Large readable information

Minimal unnecessary animation

Public display:

Visually impressive

Premium

Welcoming

Large typography

Smooth transitions

Clear status messages

Suitable for a school Annual Day demonstration

Build this as a functional MVP, not just a visual prototype.

Do not add unnecessary features outside this scope.


for theme and any further details visit our school site - bpspilani.edu.in

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e5d53c6a-b175-4bf3-be3b-4a99bff888d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
