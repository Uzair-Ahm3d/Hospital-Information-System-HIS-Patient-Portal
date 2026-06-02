# Patient Profile Update - Implementation Guide

## Overview
This update allows patients to edit their name and email in their profile, with automatic cascading updates to all related tables using database triggers.

## Changes Made

### 1. Frontend Changes (components/patient/profile-client.tsx)
- Added editable fields for first name, last name, and email
- Updated form state management to include these fields
- Modified the update handler to send name and email data
- Added page reload after successful update to reflect changes

### 2. Backend Changes (app/api/patient/update-profile/route.ts)
- Updated API to accept firstName, lastName, and email parameters
- Added validation for required fields (first name and last name)
- Modified SQL UPDATE query to include name and email fields
- Database trigger handles cascading updates to related tables

### 3. Database Changes (database/UPDATE_PATIENT_CASCADE_TRIGGER.sql)
- Created trigger `HIS_PATIENT_NAME_CASCADE_TRG`
- Automatically updates patient names in all related tables:
  - HIS_LABORATORY (LAB_PAT_NAME)
  - HIS_MEDICAL_RECORDS (MDR_PAT_NAME)
  - HIS_PATIENT_TRANSFER (PT_PAT_NAME)
  - HIS_PRESCRIPTIONS (PRES_PAT_NAME)
  - HIS_SURGERY (SURG_PAT_NAME)
  - HIS_VITALS (VIT_PAT_NAME)

## Database Setup Instructions

**IMPORTANT:** You must run the trigger SQL file in your Oracle database for the cascading updates to work.

### Steps to Apply Database Trigger:

1. Open Oracle SQL Developer or SQL*Plus
2. Connect to your database
3. Open the file: `database/UPDATE_PATIENT_CASCADE_TRIGGER.sql`
4. Execute the entire script

**OR** run this command:
```sql
@W:\FULLSTACK\dbms-project\database\UPDATE_PATIENT_CASCADE_TRIGGER.sql
```

### Verify Trigger Installation:
```sql
-- Check if trigger exists
SELECT trigger_name, status 
FROM user_triggers 
WHERE trigger_name = 'HIS_PATIENT_NAME_CASCADE_TRG';

-- Should return:
-- TRIGGER_NAME                    STATUS
-- ------------------------------- -------
-- HIS_PATIENT_NAME_CASCADE_TRG    ENABLED
```

## How It Works

### The Update Flow:
1. **Patient edits profile** - Changes first name, last name, or email
2. **Frontend sends request** - All fields sent to API endpoint
3. **API validates & updates** - Updates HIS_PATIENTS table
4. **Trigger fires automatically** - Cascades name changes to related tables
5. **Page reloads** - Shows updated information

### Foreign Key Relationships:
The system uses `PAT_NUMBER` as the foreign key to link patients across tables:
- `HIS_PATIENTS.PAT_NUMBER` (Primary)
- All related tables reference this via FK constraints

The trigger ensures that when `PAT_FNAME` or `PAT_LNAME` changes in `HIS_PATIENTS`, the concatenated full name is automatically updated in all child tables.

## Testing

### Manual Test Steps:
1. Login as a patient
2. Navigate to Profile page
3. Click "Edit" button
4. Change first name, last name, or email
5. Click "Save Changes"
6. Verify success message appears
7. Page should reload with new information
8. Check related records (prescriptions, lab tests, etc.) show updated name

### Database Verification:
```sql
-- Check patient record
SELECT PAT_NUMBER, PAT_FNAME, PAT_LNAME, PAT_EMAIL 
FROM HIS_PATIENTS 
WHERE PAT_NUMBER = 'your_patient_number';

-- Check laboratory records
SELECT LAB_PAT_NAME, LAB_PAT_NUMBER 
FROM HIS_LABORATORY 
WHERE LAB_PAT_NUMBER = 'your_patient_number';

-- Check prescriptions
SELECT PRES_PAT_NAME, PRES_PAT_NUMBER 
FROM HIS_PRESCRIPTIONS 
WHERE PRES_PAT_NUMBER = 'your_patient_number';

-- Check medical records
SELECT MDR_PAT_NAME, MDR_PAT_NUMBER 
FROM HIS_MEDICAL_RECORDS 
WHERE MDR_PAT_NUMBER = 'your_patient_number';
```

## Important Notes

1. **Email Updates**: Only updates in HIS_PATIENTS table. Other tables don't store email.

2. **Trigger Performance**: The trigger updates multiple tables, which may take slightly longer for patients with many historical records.

3. **Data Consistency**: The trigger ensures data consistency across all tables automatically.

4. **Error Handling**: If the trigger fails, the entire transaction is rolled back, ensuring data integrity.

5. **Security**: Only authenticated patients can update their own profile (verified by session).

## Troubleshooting

### If updates don't cascade:
- Verify trigger is installed: `SELECT * FROM user_triggers WHERE trigger_name = 'HIS_PATIENT_NAME_CASCADE_TRG';`
- Check trigger is enabled: Should show `STATUS = 'ENABLED'`
- Check for trigger errors: `SELECT * FROM user_errors WHERE name = 'HIS_PATIENT_NAME_CASCADE_TRG';`

### If trigger compilation fails:
- Ensure all referenced tables exist
- Verify column names match exactly
- Check user has UPDATE privileges on all tables

### Re-compile trigger if needed:
```sql
ALTER TRIGGER HIS_PATIENT_NAME_CASCADE_TRG COMPILE;
```

## Files Modified
- ✅ `components/patient/profile-client.tsx`
- ✅ `app/api/patient/update-profile/route.ts`
- ✅ `database/UPDATE_PATIENT_CASCADE_TRIGGER.sql` (new file)
