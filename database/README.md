# Hospital Management System (HMS) Database Schema

## Overview
This is a complete Oracle SQL database schema for a Hospital Management System with role-based access control, comprehensive patient management, and medical operations tracking.

## Database Files

### 1. **01_SCHEMA_PROJECT_CREATE.sql**
Creates the complete database structure with all tables, sequences, triggers, and constraints.

### 2. **02_SCHEMA_PROJECT_INSERT_PART1.sql**
Inserts initial data for admins, vendors, doctors, and patients (first 10 patients).

### 3. **03_SCHEMA_PROJECT_INSERT_PART2.sql**
Inserts remaining patients and all medical operation data (prescriptions, vitals, lab tests, etc.).

### 4. **UPDATE_PASSWORDS_BCRYPT.sql** ⚠️ **IMPORTANT**
Updates all admin and doctor passwords to use bcrypt hashing for security.

**Run this script AFTER running 01 and 02 to secure the passwords!**

```sql
-- Connect to your Oracle database and run:
sqlplus projectusers/your_password@localhost:1521/XEPDB1
@UPDATE_PASSWORDS_BCRYPT.sql
```

### 5. **generate-bcrypt-hashes.js**
Node.js utility script to generate new bcrypt hashes if you need to create new users or change passwords.

#### Tables Created (20 Total)

**Core User & Authentication:**
- `HIS_ADMIN` - Hospital administrators
- `HIS_DOCS` - Medical doctors and physicians
- `HIS_PATIENTS` - Patient information
- `HIS_USERS` - Unified user accounts
- `HIS_ROLES` - User roles (Admin, Doctor, Patient)
- `HIS_PRIVILEGES` - System privileges
- `HIS_ROLE_PRIVILEGES` - Role-privilege mapping
- `HIS_PWDRESETS` - Password reset tokens

**Vendor & Inventory:**
- `HIS_VENDOR` - Medical suppliers and vendors
- `HIS_PHARMACEUTICALS_CATEGORIES` - Drug categories
- `HIS_PHARMACEUTICALS` - Medication inventory
- `HIS_EQUIPMENTS` - Medical equipment

**Financial:**
- `HIS_ACCOUNTS` - Financial accounts
- `HIS_ASSETS` - Hospital assets
- `HIS_PAYROLLS` - Employee payroll

**Medical Operations:**
- `HIS_LABORATORY` - Lab tests and results
- `HIS_MEDICAL_RECORDS` - Patient medical history
- `HIS_PRESCRIPTIONS` - Medication prescriptions
- `HIS_SURGERY` - Surgical procedures
- `HIS_VITALS` - Patient vital signs
- `HIS_PATIENT_TRANSFER` - Patient ward transfers

#### Key Features:
- ✅ **Normalized to 3NF** - No data redundancy
- ✅ **Auto-incrementing IDs** - Using Oracle sequences and triggers
- ✅ **Foreign Key Constraints** - Referential integrity maintained
- ✅ **Timestamp Tracking** - CREATED_AT and UPDATED_AT on all tables
- ✅ **Oracle Optimized** - Uses VARCHAR2, NUMBER, TIMESTAMP data types
- ✅ **Cascading Deletes** - Proper cleanup of related records

---

### 2. **02_SCHEMA_PROJECT_INSERT_PART1.sql**
Inserts initial core data including users, roles, vendors, and patients.

#### Data Inserted:
- **1 Admin User**
  - Email: `admin@curewell.com`
  - Password: `admin123` (SHA1 hashed)

- **Roles & Privileges System**
  - 3 Roles: Admin, Doctor, Patient
  - 7 Privileges with proper role assignments

- **15 Vendors**
  - Medical supply companies
  - Pharmaceutical distributors
  - Equipment manufacturers

- **12 Pharmaceutical Categories**
  - Analgesics, Antibiotics, Cardiovascular, etc.

- **15 Pharmaceuticals**
  - Common medications with inventory tracking
  - Expiry dates and vendor information

- **10 Doctors**
  - Various specializations: Cardiology, Neurology, Pediatrics, etc.
  - Email: `firstname.lastname@curewell.com`
  - Password: `doctor123` (SHA-256 hashed)

- **20 Patients**
  - Realistic demographic data
  - Assigned to appropriate doctors
  - Complete medical information

---

### 3. **03_SCHEMA_PROJECT_INSERT_PART2.sql**
Inserts operational data including medical records, transactions, and user accounts.

#### Data Inserted:
- **10 Financial Accounts**
  - Operating accounts, receivables, payables
  - Asset and equity accounts

- **12 Hospital Assets**
  - MRI Scanner, CT Scanner, Surgical Robots
  - Purchase costs and serial numbers

- **15 Equipment Items**
  - Stethoscopes, BP monitors, wheelchairs
  - Quantity tracking and locations

- **15 Laboratory Tests**
  - Patient test orders and results
  - Pending and completed statuses

- **15 Medical Records**
  - Comprehensive patient diagnoses
  - Treatment plans and prescriptions

- **12 Patient Transfers**
  - Ward-to-ward movements
  - Transfer reasons and authorization

- **10 Payroll Records**
  - Doctor salary payments
  - November 2024 period

- **20 Prescriptions**
  - Active and completed medications
  - Dosage, frequency, and duration

- **15 Surgeries**
  - Completed, scheduled, and in-progress
  - Procedure types and durations

- **20 Vital Sign Records**
  - Temperature, pulse, BP, oxygen saturation
  - Recorded by nursing staff

- **31 User Accounts**
  - 1 Admin account
  - 10 Doctor accounts
  - 20 Patient accounts
  - Password hashes and role assignments

---

## Installation Instructions

### Prerequisites
- Oracle Database 11g or higher
- Oracle SQL Developer or SQL*Plus
- Sufficient privileges to create tables and sequences

### Step-by-Step Setup

1. **Connect to Oracle Database**
   ```sql
   -- Using SQL*Plus
   sqlplus username/password@database
   
   -- Or use Oracle SQL Developer GUI
   ```

2. **Run Schema Creation**
   ```sql
   @01_SCHEMA_PROJECT_CREATE.sql
   ```
   This creates all tables, sequences, and triggers.

3. **Insert Core Data**
   ```sql
   @02_SCHEMA_PROJECT_INSERT_PART1.sql
   ```
   This populates roles, users, vendors, doctors, and patients.

4. **Insert Operational Data**
   ```sql
   @03_SCHEMA_PROJECT_INSERT_PART2.sql
   ```
   This adds medical records, prescriptions, surgeries, and transactions.

5. **Verify Installation**
   ```sql
   -- Check table count
   SELECT COUNT(*) FROM user_tables WHERE table_name LIKE 'HIS_%';
   -- Should return 20
   
   -- Check data
   SELECT COUNT(*) FROM HIS_PATIENTS;  -- Should return 20
   SELECT COUNT(*) FROM HIS_DOCS;      -- Should return 10
   SELECT COUNT(*) FROM HIS_USERS;     -- Should return 31
   ```

---

## Default Login Credentials

### Admin Account
- **Email:** `admin@curewell.com`
- **Password:** `admin123`
- **Role:** Full system administrator

### Doctor Accounts (Sample)
- **Email:** `sarah.johnson@curewell.com`
- **Password:** `doctor123`
- **Specialization:** Cardiologist

- **Email:** `michael.chen@curewell.com`
- **Password:** `doctor123`
- **Specialization:** Neurologist

### Patient Accounts (Sample)
- **Email:** `robert.thompson@email.com`
- **Password:** `password`
- **Patient ID:** PAT001

---

## Database Schema Diagram

```
┌─────────────┐
│  HIS_USERS  │ (Main authentication)
└──────┬──────┘
       │
       ├──────► HIS_ADMIN (Administrators)
       │
       ├──────► HIS_DOCS (Doctors)
       │           │
       │           └──────► HIS_PATIENTS (Assigned patients)
       │                       │
       │                       ├──────► HIS_PRESCRIPTIONS
       │                       ├──────► HIS_VITALS
       │                       ├──────► HIS_LABORATORY
       │                       ├──────► HIS_SURGERY
       │                       ├──────► HIS_MEDICAL_RECORDS
       │                       └──────► HIS_PATIENT_TRANSFER
       │
       └──────► HIS_ROLES ───► HIS_PRIVILEGES
                    │
                    └──────► HIS_ROLE_PRIVILEGES

┌──────────────────┐
│  HIS_VENDOR      │
└────────┬─────────┘
         │
         ├──────► HIS_PHARMACEUTICALS
         ├──────► HIS_EQUIPMENTS
         └──────► HIS_ASSETS

┌──────────────────┐
│  HIS_ACCOUNTS    │ (Financial management)
└──────────────────┘

┌──────────────────┐
│  HIS_PAYROLLS    │ (Doctor payments)
└──────────────────┘
```

---

## Key Relationships

### Patient Management Flow
1. **Patient Registration** → `HIS_PATIENTS`
2. **Doctor Assignment** → `PAT_ASSIGNED_DOC` (foreign key to `HIS_DOCS`)
3. **Medical Records** → `HIS_MEDICAL_RECORDS`
4. **Prescriptions** → `HIS_PRESCRIPTIONS`
5. **Lab Tests** → `HIS_LABORATORY`
6. **Vital Signs** → `HIS_VITALS`
7. **Surgeries** → `HIS_SURGERY`
8. **Transfers** → `HIS_PATIENT_TRANSFER`

### User Authentication Flow
1. **User Creation** → `HIS_USERS`
2. **Role Assignment** → `HIS_ROLES`
3. **Privilege Mapping** → `HIS_ROLE_PRIVILEGES`
4. **Password Reset** → `HIS_PWDRESETS` (if needed)

### Inventory Management Flow
1. **Vendor Registration** → `HIS_VENDOR`
2. **Category Creation** → `HIS_PHARMACEUTICALS_CATEGORIES`
3. **Pharmaceutical Entry** → `HIS_PHARMACEUTICALS`
4. **Equipment Tracking** → `HIS_EQUIPMENTS`
5. **Asset Management** → `HIS_ASSETS`

---

## Data Integrity Rules

### Constraints Enforced:
- ✅ Unique email addresses for all users
- ✅ Patient must be assigned to an existing doctor
- ✅ Prescription must reference valid patient and doctor
- ✅ Laboratory tests must reference valid patient and doctor
- ✅ Pharmaceutical must belong to valid category
- ✅ Pharmaceutical must have valid vendor
- ✅ Surgery must reference valid patient and doctor
- ✅ Role privileges must reference valid roles and privileges

### Cascading Rules:
- 🔄 Deleting a role deletes associated privileges
- 🔄 Deleting a vendor updates related pharmaceuticals
- 🔄 Deleting a category updates related pharmaceuticals

---

## Sample Queries

### Get All Patients for a Doctor
```sql
SELECT * FROM HIS_PATIENTS 
WHERE PAT_ASSIGNED_DOC = 'DOC001';
```

### Get Active Prescriptions for a Patient
```sql
SELECT * FROM HIS_PRESCRIPTIONS 
WHERE PRES_PAT_NUMBER = 'PAT001' 
AND PRES_STATUS = 'Active';
```

### Get Recent Lab Results
```sql
SELECT * FROM HIS_LABORATORY 
WHERE LAB_PAT_NUMBER = 'PAT001' 
AND LAB_STATUS = 'Completed'
ORDER BY LAB_COMPLETED_DATE DESC;
```

### Get Doctor's Scheduled Surgeries
```sql
SELECT * FROM HIS_SURGERY 
WHERE SURG_DOC_NUMBER = 'DOC004' 
AND SURG_STATUS = 'Scheduled'
ORDER BY SURG_DATE ASC;
```

### Get Low Stock Pharmaceuticals
```sql
SELECT PHAR_NAME, PHAR_QTY, PHAR_EXPIRY_DATE 
FROM HIS_PHARMACEUTICALS 
WHERE PHAR_QTY < 1000
ORDER BY PHAR_QTY ASC;
```

### Get Patient Vital Trends
```sql
SELECT VIT_RECORDED_DATE, VIT_BLOOD_PRESSURE, VIT_HEARTPULSE, VIT_OXYGEN_SAT
FROM HIS_VITALS
WHERE VIT_PAT_NUMBER = 'PAT001'
ORDER BY VIT_RECORDED_DATE DESC;
```

---

## Normalization Details

### First Normal Form (1NF)
- ✅ All columns contain atomic values
- ✅ No repeating groups
- ✅ Each column contains values of a single type

### Second Normal Form (2NF)
- ✅ All non-key attributes depend on the entire primary key
- ✅ No partial dependencies

### Third Normal Form (3NF)
- ✅ No transitive dependencies
- ✅ Non-key attributes depend only on primary key
- ✅ Separate tables for categories, roles, vendors

---

## Maintenance & Cleanup

### To Reset Database (Caution!)
```sql
-- Run the cleanup section from 01_SCHEMA_PROJECT_CREATE.sql
-- This will drop all tables, sequences, and views
```

### To Update Records
```sql
-- Example: Update patient information
UPDATE HIS_PATIENTS 
SET PAT_PHONE = '+1-555-9999', UPDATED_AT = SYSTIMESTAMP
WHERE PAT_NUMBER = 'PAT001';

-- Example: Complete a lab test
UPDATE HIS_LABORATORY 
SET LAB_STATUS = 'Completed', 
    LAB_COMPLETED_DATE = SYSTIMESTAMP,
    LAB_PAT_RESULTS = 'Test results here'
WHERE LAB_NUMBER = 'LAB003';
```

### To Add New Records
```sql
-- Example: Add new patient
INSERT INTO HIS_PATIENTS (
    PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER,
    PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, 
    PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP
) VALUES (
    'John', 'Doe', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 34, 'PAT021',
    '123 Main St', '+1-555-1234', 'john.doe@email.com', 'OutPatient',
    'DOC001', 'Hypertension', 'Male', 'O+'
);
```

---

## Troubleshooting

### Common Issues

**Issue:** Sequence not found
```sql
-- Solution: Verify sequences exist
SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'HIS_%';
```

**Issue:** Foreign key constraint violation
```sql
-- Solution: Ensure referenced records exist
-- Example: Check if doctor exists before assigning patient
SELECT * FROM HIS_DOCS WHERE DOC_NUMBER = 'DOC001';
```

**Issue:** Unique constraint violation
```sql
-- Solution: Check for duplicate emails or IDs
SELECT PAT_EMAIL, COUNT(*) FROM HIS_PATIENTS GROUP BY PAT_EMAIL HAVING COUNT(*) > 1;
```

---

## Security Considerations

### Password Storage
- Admin passwords: SHA1 hashed
- Doctor passwords: SHA-256 hashed
- Patient passwords: SHA-256 hashed
- **Important:** In production, use bcrypt or Argon2

### Access Control
- Role-based permissions via `HIS_ROLES` and `HIS_PRIVILEGES`
- Admin: Full access
- Doctor: Patient care and medical records
- Patient: View own records only

### Data Privacy
- Patient data includes PHI (Protected Health Information)
- Implement additional encryption for production
- Audit logs recommended for compliance

---

## Support & Contact

For questions or issues:
- Review the SQL comments in each file
- Check Oracle documentation
- Verify data types and constraints match your Oracle version

---

## License

This schema is provided as-is for educational and development purposes.

---

**Last Updated:** December 2024  
**Oracle Version:** 11g+  
**Schema Version:** 1.0
