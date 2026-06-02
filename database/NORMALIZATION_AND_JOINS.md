# Database Normalization and Joins Documentation

## Hospital Management System (HMS) - Database Design

---

## Table of Contents
1. [Normalization Overview](#normalization-overview)
2. [Database Normalization by Normal Form](#database-normalization-by-normal-form)
3. [Table-by-Table Normalization Analysis](#table-by-table-normalization-analysis)
4. [Foreign Key Relationships](#foreign-key-relationships)
5. [Joins Used in the Application](#joins-used-in-the-application)
6. [Query Examples with Joins](#query-examples-with-joins)
7. [Performance Considerations](#performance-considerations)

---

## Normalization Overview

The Hospital Management System database is designed to **Third Normal Form (3NF)**, ensuring:
- ✅ **No Redundant Data** - Each piece of information is stored once
- ✅ **Data Integrity** - Constraints and foreign keys maintain consistency
- ✅ **Efficient Updates** - Changes propagate through foreign key relationships
- ✅ **Scalability** - Normalized structure supports growth and modifications

### Normalization Goals Achieved:
- **1NF (First Normal Form)**: All attributes contain atomic values (no repeating groups)
- **2NF (Second Normal Form)**: All non-key attributes fully depend on the primary key
- **3NF (Third Normal Form)**: No transitive dependencies (non-key attributes don't depend on other non-key attributes)

---

## Database Normalization by Normal Form

### First Normal Form (1NF)
**Rule**: All columns must contain atomic (indivisible) values, and each row must be unique.

**Implementation**:
- ✅ Every table has a **PRIMARY KEY** (e.g., `AD_ID`, `DOC_ID`, `PAT_ID`)
- ✅ All columns contain single values (no arrays or comma-separated lists)
- ✅ Each table has unique sequences for auto-incrementing IDs

**Example - HIS_PATIENTS**:
```sql
CREATE TABLE HIS_PATIENTS (
    PAT_ID NUMBER PRIMARY KEY,              -- Unique identifier
    PAT_FNAME VARCHAR2(200) NOT NULL,       -- Atomic value
    PAT_LNAME VARCHAR2(200) NOT NULL,       -- Atomic value
    PAT_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    PAT_PHONE VARCHAR2(200),                -- Single phone number
    ...
);
```

### Second Normal Form (2NF)
**Rule**: Must be in 1NF, and all non-key attributes must fully depend on the entire primary key.

**Implementation**:
- ✅ Single-column primary keys ensure full functional dependency
- ✅ No partial dependencies exist
- ✅ Composite keys (where used) have all attributes dependent on the full key

**Example - HIS_PRESCRIPTIONS**:
```sql
CREATE TABLE HIS_PRESCRIPTIONS (
    PRES_ID NUMBER PRIMARY KEY,             -- Single primary key
    PRES_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    PRES_PAT_NUMBER VARCHAR2(200) NOT NULL, -- References patient
    PRES_DOC_NUMBER VARCHAR2(200),          -- References doctor
    PRES_MEDICATION VARCHAR2(500),
    PRES_DOSAGE VARCHAR2(200),
    ...
);
```
All attributes (medication, dosage, frequency) depend on `PRES_ID`, not on partial keys.

### Third Normal Form (3NF)
**Rule**: Must be in 2NF, and no transitive dependencies (non-key attributes depending on other non-key attributes).

**Implementation**:
- ✅ Related data moved to separate tables with foreign key relationships
- ✅ Doctor information not duplicated in patient records (referenced via `DOC_NUMBER`)
- ✅ Vendor information separated from pharmaceuticals and equipment
- ✅ Patient information not duplicated in prescriptions, labs, vitals, etc.

**Example - Eliminating Transitive Dependency**:

❌ **BEFORE (Not 3NF)**:
```sql
-- BAD: Doctor details repeated in patient table
HIS_PATIENTS (
    PAT_ID,
    PAT_NAME,
    DOC_NAME,           -- Transitive dependency
    DOC_EMAIL,          -- Transitive dependency
    DOC_PHONE,          -- Transitive dependency
    DOC_SPECIALIZATION  -- Transitive dependency
)
```

✅ **AFTER (3NF Compliant)**:
```sql
-- GOOD: Doctor details in separate table
HIS_PATIENTS (
    PAT_ID,
    PAT_NAME,
    PAT_ASSIGNED_DOC    -- Foreign key to HIS_DOCS
)

HIS_DOCS (
    DOC_ID,
    DOC_NUMBER,
    DOC_FNAME,
    DOC_LNAME,
    DOC_EMAIL,
    DOC_PHONE,
    DOC_SPECIALIZATION
)
```

---

## Table-by-Table Normalization Analysis

### Core User Tables

#### 1. HIS_ADMIN
**Normal Form**: 3NF ✅  
**Primary Key**: `AD_ID`  
**Purpose**: Hospital administrators

**Normalization**:
- Each admin has unique ID and email
- No repeating groups or composite attributes
- No transitive dependencies

```sql
CREATE TABLE HIS_ADMIN (
    AD_ID NUMBER PRIMARY KEY,
    AD_FNAME VARCHAR2(200) NOT NULL,
    AD_LNAME VARCHAR2(200) NOT NULL,
    AD_EMAIL VARCHAR2(200) NOT NULL UNIQUE,
    AD_PWD VARCHAR2(200) NOT NULL,
    AD_DPIC VARCHAR2(200),
    CREATED_AT TIMESTAMP DEFAULT SYSTIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT SYSTIMESTAMP
);
```

#### 2. HIS_DOCS
**Normal Form**: 3NF ✅  
**Primary Key**: `DOC_ID`  
**Unique Identifiers**: `DOC_EMAIL`, `DOC_NUMBER`

**Normalization**:
- Doctor information self-contained
- Department stored as attribute (not separate table as departments are simple values)
- Status and specialization are atomic values

```sql
CREATE TABLE HIS_DOCS (
    DOC_ID NUMBER PRIMARY KEY,
    DOC_FNAME VARCHAR2(200) NOT NULL,
    DOC_LNAME VARCHAR2(200) NOT NULL,
    DOC_EMAIL VARCHAR2(200) NOT NULL UNIQUE,
    DOC_PWD VARCHAR2(200) NOT NULL,
    DOC_DEPT VARCHAR2(200),
    DOC_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    DOC_SPECIALIZATION VARCHAR2(200),
    DOC_STATUS VARCHAR2(50) DEFAULT 'Active'
);
```

#### 3. HIS_PATIENTS
**Normal Form**: 3NF ✅  
**Primary Key**: `PAT_ID`  
**Foreign Keys**: `PAT_ASSIGNED_DOC` → `HIS_DOCS.DOC_NUMBER`

**Normalization**:
- Patient data separated from doctor data
- Doctor reference via foreign key (no duplication)
- All patient-specific attributes directly depend on `PAT_ID`

```sql
CREATE TABLE HIS_PATIENTS (
    PAT_ID NUMBER PRIMARY KEY,
    PAT_FNAME VARCHAR2(200) NOT NULL,
    PAT_LNAME VARCHAR2(200) NOT NULL,
    PAT_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    PAT_ASSIGNED_DOC VARCHAR2(200),    -- FK to HIS_DOCS
    PAT_AILMENT VARCHAR2(500),
    PAT_TYPE VARCHAR2(50),
    PAT_GENDER VARCHAR2(20),
    PAT_BLOOD_GROUP VARCHAR2(10),
    CONSTRAINT FK_PAT_DOC FOREIGN KEY (PAT_ASSIGNED_DOC) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE SET NULL
);
```

### Medical Operation Tables

#### 4. HIS_PRESCRIPTIONS
**Normal Form**: 3NF ✅  
**Primary Key**: `PRES_ID`  
**Foreign Keys**: 
- `PRES_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`
- `PRES_DOC_NUMBER` → `HIS_DOCS.DOC_NUMBER`

**Normalization**:
- Prescription details separate from patient/doctor tables
- Patient and doctor names denormalized for query performance (acceptable trade-off)
- Each prescription uniquely identified

```sql
CREATE TABLE HIS_PRESCRIPTIONS (
    PRES_ID NUMBER PRIMARY KEY,
    PRES_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    PRES_PAT_NUMBER VARCHAR2(200) NOT NULL,
    PRES_DOC_NUMBER VARCHAR2(200),
    PRES_MEDICATION VARCHAR2(500),
    PRES_DOSAGE VARCHAR2(200),
    PRES_FREQUENCY VARCHAR2(200),
    CONSTRAINT FK_PRES_PAT FOREIGN KEY (PRES_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE CASCADE,
    CONSTRAINT FK_PRES_DOC FOREIGN KEY (PRES_DOC_NUMBER) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE SET NULL
);
```

#### 5. HIS_LABORATORY
**Normal Form**: 3NF ✅  
**Primary Key**: `LAB_ID`  
**Foreign Keys**: 
- `LAB_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`
- `LAB_DOC_NUMBER` → `HIS_DOCS.DOC_NUMBER`

**Normalization**:
- Lab test data isolated from patient records
- Multiple tests can exist for same patient
- Results tracked independently

```sql
CREATE TABLE HIS_LABORATORY (
    LAB_ID NUMBER PRIMARY KEY,
    LAB_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    LAB_PAT_NUMBER VARCHAR2(200) NOT NULL,
    LAB_DOC_NUMBER VARCHAR2(200),
    LAB_PAT_TESTS VARCHAR2(1000),
    LAB_PAT_RESULTS VARCHAR2(2000),
    LAB_STATUS VARCHAR2(50) DEFAULT 'Pending',
    CONSTRAINT FK_LAB_PAT FOREIGN KEY (LAB_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE CASCADE,
    CONSTRAINT FK_LAB_DOC FOREIGN KEY (LAB_DOC_NUMBER) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE SET NULL
);
```

#### 6. HIS_VITALS
**Normal Form**: 3NF ✅  
**Primary Key**: `VIT_ID`  
**Foreign Keys**: `VIT_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`

**Normalization**:
- Vital signs tracked separately from patient master record
- Allows multiple readings over time
- No duplication of patient information

```sql
CREATE TABLE HIS_VITALS (
    VIT_ID NUMBER PRIMARY KEY,
    VIT_PAT_NUMBER VARCHAR2(200) NOT NULL,
    VIT_BODYTEMP NUMBER(5,2),
    VIT_HEARTPULSE NUMBER,
    VIT_BLOOD_PRESSURE VARCHAR2(20),
    VIT_OXYGEN_SAT NUMBER(5,2),
    VIT_RECORDED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT FK_VIT_PAT FOREIGN KEY (VIT_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE CASCADE
);
```

#### 7. HIS_SURGERY
**Normal Form**: 3NF ✅  
**Primary Key**: `SURG_ID`  
**Foreign Keys**: 
- `SURG_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`
- `SURG_DOC_NUMBER` → `HIS_DOCS.DOC_NUMBER`

```sql
CREATE TABLE HIS_SURGERY (
    SURG_ID NUMBER PRIMARY KEY,
    SURG_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    SURG_PAT_NUMBER VARCHAR2(200) NOT NULL,
    SURG_DOC_NUMBER VARCHAR2(200),
    SURG_TYPE VARCHAR2(200),
    SURG_STATUS VARCHAR2(50),
    CONSTRAINT FK_SURG_PAT FOREIGN KEY (SURG_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE CASCADE,
    CONSTRAINT FK_SURG_DOC FOREIGN KEY (SURG_DOC_NUMBER) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE SET NULL
);
```

#### 8. HIS_MEDICAL_RECORDS
**Normal Form**: 3NF ✅  
**Primary Key**: `MDR_ID`  
**Foreign Keys**: 
- `MDR_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`
- `MDR_DOC_NUMBER` → `HIS_DOCS.DOC_NUMBER`

```sql
CREATE TABLE HIS_MEDICAL_RECORDS (
    MDR_ID NUMBER PRIMARY KEY,
    MDR_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    MDR_PAT_NUMBER VARCHAR2(200) NOT NULL,
    MDR_DOC_NUMBER VARCHAR2(200),
    MDR_DIAGNOSIS VARCHAR2(1000),
    MDR_TREATMENT_PLAN VARCHAR2(2000),
    CONSTRAINT FK_MDR_PAT FOREIGN KEY (MDR_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE CASCADE,
    CONSTRAINT FK_MDR_DOC FOREIGN KEY (MDR_DOC_NUMBER) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE SET NULL
);
```

### Inventory & Vendor Tables

#### 9. HIS_VENDOR
**Normal Form**: 3NF ✅  
**Primary Key**: `V_ID`  
**Unique Identifiers**: `V_NAME`, `V_NUMBER`

**Normalization**:
- Vendor information centralized
- Referenced by pharmaceuticals, equipment, and assets

```sql
CREATE TABLE HIS_VENDOR (
    V_ID NUMBER PRIMARY KEY,
    V_NUMBER VARCHAR2(200) UNIQUE,
    V_NAME VARCHAR2(200) NOT NULL UNIQUE,
    V_ADR VARCHAR2(500),
    V_EMAIL VARCHAR2(200),
    V_PHONE VARCHAR2(200)
);
```

#### 10. HIS_PHARMACEUTICALS_CATEGORIES
**Normal Form**: 3NF ✅  
**Primary Key**: `PHARM_CAT_ID`

**Normalization**:
- Drug categories separated from individual drugs
- Allows multiple drugs per category

```sql
CREATE TABLE HIS_PHARMACEUTICALS_CATEGORIES (
    PHARM_CAT_ID NUMBER PRIMARY KEY,
    PHARM_CAT_NAME VARCHAR2(200) NOT NULL UNIQUE,
    PHARM_CAT_VENDOR VARCHAR2(200),
    PHARM_CAT_DESC VARCHAR2(1000)
);
```

#### 11. HIS_PHARMACEUTICALS
**Normal Form**: 3NF ✅  
**Primary Key**: `PHAR_ID`  
**Foreign Keys**: 
- `PHAR_VENDOR` → `HIS_VENDOR.V_NAME`
- `PHAR_CAT` → `HIS_PHARMACEUTICALS_CATEGORIES.PHARM_CAT_NAME`

**Normalization**:
- Drug information separate from vendor and category
- No duplication of vendor/category details

```sql
CREATE TABLE HIS_PHARMACEUTICALS (
    PHAR_ID NUMBER PRIMARY KEY,
    PHAR_NAME VARCHAR2(200) NOT NULL,
    PHAR_VENDOR VARCHAR2(200),
    PHAR_CAT VARCHAR2(200),
    PHAR_QTY NUMBER DEFAULT 0,
    CONSTRAINT FK_PHAR_VENDOR FOREIGN KEY (PHAR_VENDOR) 
        REFERENCES HIS_VENDOR(V_NAME) ON DELETE SET NULL,
    CONSTRAINT FK_PHAR_CAT FOREIGN KEY (PHAR_CAT) 
        REFERENCES HIS_PHARMACEUTICALS_CATEGORIES(PHARM_CAT_NAME)
);
```

#### 12. HIS_EQUIPMENTS
**Normal Form**: 3NF ✅  
**Primary Key**: `EQP_ID`  
**Foreign Keys**: `EQP_VENDOR` → `HIS_VENDOR.V_NAME`

```sql
CREATE TABLE HIS_EQUIPMENTS (
    EQP_ID NUMBER PRIMARY KEY,
    EQP_CODE VARCHAR2(200) UNIQUE,
    EQP_NAME VARCHAR2(200) NOT NULL,
    EQP_VENDOR VARCHAR2(200),
    EQP_STATUS VARCHAR2(50) DEFAULT 'Functioning',
    CONSTRAINT FK_EQP_VENDOR FOREIGN KEY (EQP_VENDOR) 
        REFERENCES HIS_VENDOR(V_NAME) ON DELETE SET NULL
);
```

#### 13. HIS_ASSETS
**Normal Form**: 3NF ✅  
**Primary Key**: `ASST_ID`  
**Foreign Keys**: `ASST_VENDOR` → `HIS_VENDOR.V_NAME`

```sql
CREATE TABLE HIS_ASSETS (
    ASST_ID NUMBER PRIMARY KEY,
    ASST_NAME VARCHAR2(200) NOT NULL,
    ASST_VENDOR VARCHAR2(200),
    ASST_STATUS VARCHAR2(50) DEFAULT 'Active',
    CONSTRAINT FK_ASST_VENDOR FOREIGN KEY (ASST_VENDOR) 
        REFERENCES HIS_VENDOR(V_NAME) ON DELETE SET NULL
);
```

### Financial Tables

#### 14. HIS_ACCOUNTS
**Normal Form**: 3NF ✅  
**Primary Key**: `ACC_ID`

```sql
CREATE TABLE HIS_ACCOUNTS (
    ACC_ID NUMBER PRIMARY KEY,
    ACC_NAME VARCHAR2(200) NOT NULL,
    ACC_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    ACC_TYPE VARCHAR2(100),
    ACC_AMOUNT NUMBER(15,2) DEFAULT 0
);
```

#### 15. HIS_PAYROLLS
**Normal Form**: 3NF ✅  
**Primary Key**: `PAY_ID`  
**Foreign Keys**: `PAY_DOC_NUMBER` → `HIS_DOCS.DOC_NUMBER`

```sql
CREATE TABLE HIS_PAYROLLS (
    PAY_ID NUMBER PRIMARY KEY,
    PAY_NUMBER VARCHAR2(200) NOT NULL UNIQUE,
    PAY_DOC_NUMBER VARCHAR2(200) NOT NULL,
    PAY_AMOUNT NUMBER(12,2),
    PAY_STATUS VARCHAR2(50) DEFAULT 'Pending',
    CONSTRAINT FK_PAY_DOC FOREIGN KEY (PAY_DOC_NUMBER) 
        REFERENCES HIS_DOCS(DOC_NUMBER) ON DELETE CASCADE
);
```

### Transfer & Movement Tables

#### 16. HIS_PATIENT_TRANSFER
**Normal Form**: 3NF ✅  
**Primary Key**: `PT_ID`  
**Foreign Keys**: `PT_PAT_NUMBER` → `HIS_PATIENTS.PAT_NUMBER`

```sql
CREATE TABLE HIS_PATIENT_TRANSFER (
    PT_ID NUMBER PRIMARY KEY,
    PT_PAT_NUMBER VARCHAR2(200),
    PT_FROM_WARD VARCHAR2(200),
    PT_TO_WARD VARCHAR2(200),
    PT_STATUS VARCHAR2(50),
    CONSTRAINT FK_TRANSFER_PAT FOREIGN KEY (PT_PAT_NUMBER) 
        REFERENCES HIS_PATIENTS(PAT_NUMBER) ON DELETE SET NULL
);
```

### Authentication & Authorization Tables

#### 17. HIS_ROLES
**Normal Form**: 3NF ✅  
**Primary Key**: `ROLE_ID`

```sql
CREATE TABLE HIS_ROLES (
    ROLE_ID NUMBER PRIMARY KEY,
    ROLE_NAME VARCHAR2(100) NOT NULL UNIQUE,
    ROLE_DESC VARCHAR2(1000),
    ROLE_LEVEL NUMBER DEFAULT 1
);
```

#### 18. HIS_PRIVILEGES
**Normal Form**: 3NF ✅  
**Primary Key**: `PRIV_ID`

```sql
CREATE TABLE HIS_PRIVILEGES (
    PRIV_ID NUMBER PRIMARY KEY,
    PRIV_NAME VARCHAR2(100) NOT NULL UNIQUE,
    PRIV_MODULE VARCHAR2(100)
);
```

#### 19. HIS_ROLE_PRIVILEGES
**Normal Form**: 3NF ✅  
**Primary Key**: `RP_ID`  
**Foreign Keys**: 
- `ROLE_ID` → `HIS_ROLES.ROLE_ID`
- `PRIV_ID` → `HIS_PRIVILEGES.PRIV_ID`

**Normalization**:
- Many-to-many relationship resolved via junction table
- Eliminates redundancy in role-privilege assignments

```sql
CREATE TABLE HIS_ROLE_PRIVILEGES (
    RP_ID NUMBER PRIMARY KEY,
    ROLE_ID NUMBER NOT NULL,
    PRIV_ID NUMBER NOT NULL,
    CONSTRAINT FK_RP_ROLE FOREIGN KEY (ROLE_ID) 
        REFERENCES HIS_ROLES(ROLE_ID) ON DELETE CASCADE,
    CONSTRAINT FK_RP_PRIV FOREIGN KEY (PRIV_ID) 
        REFERENCES HIS_PRIVILEGES(PRIV_ID) ON DELETE CASCADE,
    CONSTRAINT UQ_ROLE_PRIV UNIQUE (ROLE_ID, PRIV_ID)
);
```

#### 20. HIS_USERS
**Normal Form**: 3NF ✅  
**Primary Key**: `USER_ID`  
**Foreign Keys**: `USER_ROLE_ID` → `HIS_ROLES.ROLE_ID`

```sql
CREATE TABLE HIS_USERS (
    USER_ID NUMBER PRIMARY KEY,
    USER_EMAIL VARCHAR2(200) NOT NULL UNIQUE,
    USER_ROLE_ID NUMBER,
    USER_STATUS VARCHAR2(50) DEFAULT 'Active',
    CONSTRAINT FK_USER_ROLE FOREIGN KEY (USER_ROLE_ID) 
        REFERENCES HIS_ROLES(ROLE_ID) ON DELETE SET NULL
);
```

---

## Foreign Key Relationships

### Relationship Summary

| **Child Table** | **Foreign Key** | **Parent Table** | **Referenced Column** | **Cascade Rule** |
|----------------|-----------------|------------------|-----------------------|------------------|
| HIS_PATIENTS | PAT_ASSIGNED_DOC | HIS_DOCS | DOC_NUMBER | ON DELETE SET NULL |
| HIS_PHARMACEUTICALS | PHAR_VENDOR | HIS_VENDOR | V_NAME | ON DELETE SET NULL |
| HIS_PHARMACEUTICALS | PHAR_CAT | HIS_PHARMACEUTICALS_CATEGORIES | PHARM_CAT_NAME | ON DELETE SET NULL |
| HIS_ASSETS | ASST_VENDOR | HIS_VENDOR | V_NAME | ON DELETE SET NULL |
| HIS_EQUIPMENTS | EQP_VENDOR | HIS_VENDOR | V_NAME | ON DELETE SET NULL |
| HIS_LABORATORY | LAB_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE CASCADE |
| HIS_LABORATORY | LAB_DOC_NUMBER | HIS_DOCS | DOC_NUMBER | ON DELETE SET NULL |
| HIS_MEDICAL_RECORDS | MDR_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE CASCADE |
| HIS_MEDICAL_RECORDS | MDR_DOC_NUMBER | HIS_DOCS | DOC_NUMBER | ON DELETE SET NULL |
| HIS_PATIENT_TRANSFER | PT_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE SET NULL |
| HIS_PAYROLLS | PAY_DOC_NUMBER | HIS_DOCS | DOC_NUMBER | ON DELETE CASCADE |
| HIS_PRESCRIPTIONS | PRES_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE CASCADE |
| HIS_PRESCRIPTIONS | PRES_DOC_NUMBER | HIS_DOCS | DOC_NUMBER | ON DELETE SET NULL |
| HIS_SURGERY | SURG_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE CASCADE |
| HIS_SURGERY | SURG_DOC_NUMBER | HIS_DOCS | DOC_NUMBER | ON DELETE SET NULL |
| HIS_VITALS | VIT_PAT_NUMBER | HIS_PATIENTS | PAT_NUMBER | ON DELETE CASCADE |
| HIS_USERS | USER_ROLE_ID | HIS_ROLES | ROLE_ID | ON DELETE SET NULL |
| HIS_ROLE_PRIVILEGES | ROLE_ID | HIS_ROLES | ROLE_ID | ON DELETE CASCADE |
| HIS_ROLE_PRIVILEGES | PRIV_ID | HIS_PRIVILEGES | PRIV_ID | ON DELETE CASCADE |

### Cascade Delete Strategy

**ON DELETE CASCADE**: Used when child records have no meaning without the parent
- Patient deleted → All prescriptions, lab tests, vitals, surgeries deleted
- Doctor deleted → Payrolls deleted (historical data tied to that doctor)
- Role deleted → Role privileges deleted

**ON DELETE SET NULL**: Used when child records should persist but lose reference
- Doctor deleted → Patients remain but assigned doctor set to NULL
- Vendor deleted → Equipment remains but vendor reference cleared

---

## Joins Used in the Application

### Types of Joins Implemented

#### 1. INNER JOIN
**Purpose**: Returns only matching records from both tables

**Usage Example - Patient Vitals**:
```sql
SELECT 
    v.VIT_ID, v.VIT_PAT_NUMBER, v.VIT_BODYTEMP, 
    v.VIT_BLOOD_PRESSURE, v.VIT_HEARTPULSE,
    p.PAT_FNAME, p.PAT_LNAME
FROM HIS_VITALS v
INNER JOIN HIS_PATIENTS p ON v.VIT_PAT_NUMBER = p.PAT_NUMBER
WHERE p.PAT_ASSIGNED_DOC = 'DOC-0001'
ORDER BY v.VIT_RECORDED_DATE DESC;
```
**When Used**: When both parent and child records must exist (e.g., vitals must have a valid patient)

#### 2. LEFT JOIN (LEFT OUTER JOIN)
**Purpose**: Returns all records from the left table and matching records from the right table

**Usage Example - Laboratory Tests**:
```sql
SELECT 
    l.LAB_ID, l.LAB_NUMBER, l.LAB_PAT_TESTS, l.LAB_STATUS,
    p.PAT_FNAME, p.PAT_LNAME, p.PAT_NUMBER,
    d.DOC_FNAME, d.DOC_LNAME
FROM HIS_LABORATORY l
LEFT JOIN HIS_PATIENTS p ON l.LAB_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON l.LAB_DOC_NUMBER = d.DOC_NUMBER
WHERE l.LAB_DOC_NUMBER = 'DOC-0002'
ORDER BY l.LAB_DATE_REC DESC;
```
**When Used**: When the left table record should appear even if related records don't exist

#### 3. Medical Records with Prescription Details
**Query**: `/api/records/route.ts`
```sql
SELECT 
    m.MDR_ID,
    m.MDR_NUMBER,
    m.MDR_PAT_NAME,
    m.MDR_DIAGNOSIS,
    m.MDR_TREATMENT_PLAN,
    p.PRES_MEDICATION,
    p.PRES_DOSAGE,
    p.PRES_FREQUENCY
FROM HIS_MEDICAL_RECORDS m
LEFT JOIN HIS_PRESCRIPTIONS p ON m.MDR_PAT_PRESCR = p.PRES_NUMBER
ORDER BY m.MDR_ID DESC;
```
**Join Type**: LEFT JOIN  
**Reason**: Medical records can exist without prescriptions

---

## Query Examples with Joins

### Query 1: Doctor's Assigned Patients
**Objective**: Get all patients assigned to a specific doctor with doctor details

```sql
SELECT 
    p.PAT_ID, 
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS Patient_Name,
    p.PAT_NUMBER, 
    p.PAT_PHONE, 
    p.PAT_EMAIL, 
    p.PAT_AILMENT, 
    p.PAT_TYPE, 
    p.PAT_DISCHARGE_STATUS,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS Doctor_Name,
    d.DOC_DEPT,
    d.DOC_SPECIALIZATION
FROM HIS_PATIENTS p
LEFT JOIN HIS_DOCS d ON p.PAT_ASSIGNED_DOC = d.DOC_NUMBER
WHERE p.PAT_ASSIGNED_DOC = 'DOC-0003'
ORDER BY p.PAT_ID DESC;
```
**Join Analysis**:
- **Type**: LEFT JOIN
- **Tables**: HIS_PATIENTS (left), HIS_DOCS (right)
- **Join Condition**: `p.PAT_ASSIGNED_DOC = d.DOC_NUMBER`
- **Result**: All patients assigned to doctor, with doctor details

### Query 2: Patient Surgical Procedures
**Objective**: List all surgeries with patient and doctor information

```sql
SELECT 
    s.SURG_NUMBER,
    s.SURG_TYPE,
    s.SURG_DATE,
    s.SURG_STATUS,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS Patient_Name,
    p.PAT_NUMBER,
    p.PAT_AGE,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS Surgeon_Name,
    d.DOC_DEPT
FROM HIS_SURGERY s
LEFT JOIN HIS_PATIENTS p ON s.SURG_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON s.SURG_DOC_NUMBER = d.DOC_NUMBER
WHERE s.SURG_DOC_NUMBER = 'DOC-0005'
ORDER BY s.SURG_DATE DESC;
```
**Join Analysis**:
- **Type**: LEFT JOIN (two joins)
- **Tables**: HIS_SURGERY (base), HIS_PATIENTS, HIS_DOCS
- **Join Conditions**: 
  - `s.SURG_PAT_NUMBER = p.PAT_NUMBER`
  - `s.SURG_DOC_NUMBER = d.DOC_NUMBER`
- **Result**: All surgeries with patient and doctor details (even if references missing)

### Query 3: Patient Transfers with Details
**Objective**: Track patient ward transfers

```sql
SELECT 
    pt.PT_ID,
    pt.PT_FROM_WARD,
    pt.PT_TO_WARD,
    pt.PT_REASON,
    pt.PT_TRANSFER_DATE,
    pt.PT_STATUS,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS Patient_Name,
    p.PAT_NUMBER,
    p.PAT_TYPE
FROM HIS_PATIENT_TRANSFER pt
INNER JOIN HIS_PATIENTS p ON pt.PT_PAT_NUMBER = p.PAT_NUMBER
WHERE pt.PT_STATUS = 'Completed'
ORDER BY pt.PT_TRANSFER_DATE DESC;
```
**Join Analysis**:
- **Type**: INNER JOIN
- **Tables**: HIS_PATIENT_TRANSFER, HIS_PATIENTS
- **Join Condition**: `pt.PT_PAT_NUMBER = p.PAT_NUMBER`
- **Result**: Only transfers with valid patient records

### Query 4: Pharmaceutical Inventory with Vendor Details
**Objective**: List all medicines with vendor and category information

```sql
SELECT 
    ph.PHAR_ID,
    ph.PHAR_NAME,
    ph.PHAR_QTY,
    ph.PHAR_UNIT_PRICE,
    ph.PHAR_EXPIRY_DATE,
    v.V_NAME AS Vendor_Name,
    v.V_EMAIL,
    v.V_PHONE,
    c.PHARM_CAT_NAME AS Category,
    c.PHARM_CAT_DESC
FROM HIS_PHARMACEUTICALS ph
LEFT JOIN HIS_VENDOR v ON ph.PHAR_VENDOR = v.V_NAME
LEFT JOIN HIS_PHARMACEUTICALS_CATEGORIES c ON ph.PHAR_CAT = c.PHARM_CAT_NAME
WHERE ph.PHAR_QTY < 50
ORDER BY ph.PHAR_QTY ASC;
```
**Join Analysis**:
- **Type**: LEFT JOIN (two joins)
- **Tables**: HIS_PHARMACEUTICALS, HIS_VENDOR, HIS_PHARMACEUTICALS_CATEGORIES
- **Purpose**: Show all medicines even if vendor/category not assigned

### Query 5: Comprehensive Patient Medical Summary
**Objective**: Complete patient overview with all related data

```sql
SELECT 
    p.PAT_NUMBER,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS Patient_Name,
    p.PAT_AGE,
    p.PAT_AILMENT,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS Assigned_Doctor,
    COUNT(DISTINCT pr.PRES_ID) AS Total_Prescriptions,
    COUNT(DISTINCT l.LAB_ID) AS Total_Lab_Tests,
    COUNT(DISTINCT v.VIT_ID) AS Total_Vital_Records,
    COUNT(DISTINCT s.SURG_ID) AS Total_Surgeries
FROM HIS_PATIENTS p
LEFT JOIN HIS_DOCS d ON p.PAT_ASSIGNED_DOC = d.DOC_NUMBER
LEFT JOIN HIS_PRESCRIPTIONS pr ON p.PAT_NUMBER = pr.PRES_PAT_NUMBER
LEFT JOIN HIS_LABORATORY l ON p.PAT_NUMBER = l.LAB_PAT_NUMBER
LEFT JOIN HIS_VITALS v ON p.PAT_NUMBER = v.VIT_PAT_NUMBER
LEFT JOIN HIS_SURGERY s ON p.PAT_NUMBER = s.SURG_PAT_NUMBER
WHERE p.PAT_NUMBER = 'PAT-0010'
GROUP BY 
    p.PAT_NUMBER, p.PAT_FNAME, p.PAT_LNAME, p.PAT_AGE, p.PAT_AILMENT,
    d.DOC_FNAME, d.DOC_LNAME;
```
**Join Analysis**:
- **Type**: Multiple LEFT JOINs
- **Tables**: 6 tables joined
- **Aggregation**: COUNT with GROUP BY
- **Result**: Complete patient summary with statistics

### Query 6: Equipment Maintenance Report
**Objective**: Track equipment status with vendor information

```sql
SELECT 
    e.EQP_CODE,
    e.EQP_NAME,
    e.EQP_STATUS,
    e.EQP_DEPT,
    e.EQP_LOCATION,
    v.V_NAME AS Vendor,
    v.V_PHONE,
    v.V_EMAIL
FROM HIS_EQUIPMENTS e
LEFT JOIN HIS_VENDOR v ON e.EQP_VENDOR = v.V_NAME
WHERE e.EQP_STATUS IN ('Under Repair', 'Out of Service')
ORDER BY e.EQP_STATUS, e.EQP_NAME;
```

### Query 7: Doctor Payroll with Details
**Objective**: Generate payroll reports for doctors

```sql
SELECT 
    pay.PAY_NUMBER,
    pay.PAY_AMOUNT,
    pay.PAY_PERIOD,
    pay.PAY_STATUS,
    pay.PAY_DATE,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS Doctor_Name,
    d.DOC_EMAIL,
    d.DOC_DEPT,
    d.DOC_SPECIALIZATION
FROM HIS_PAYROLLS pay
INNER JOIN HIS_DOCS d ON pay.PAY_DOC_NUMBER = d.DOC_NUMBER
WHERE pay.PAY_STATUS = 'Paid'
AND pay.PAY_DATE >= DATE '2024-01-01'
ORDER BY pay.PAY_DATE DESC;
```
**Join Analysis**:
- **Type**: INNER JOIN
- **Reason**: Payroll must have valid doctor reference

---

## Performance Considerations

### Indexes Created for Join Performance

```sql
-- Patient-Doctor relationship
CREATE INDEX IDX_PAT_ASSIGNED_DOC ON HIS_PATIENTS(PAT_ASSIGNED_DOC);

-- Prescription relationships
CREATE INDEX IDX_PRES_PAT_NUMBER ON HIS_PRESCRIPTIONS(PRES_PAT_NUMBER);
CREATE INDEX IDX_PRES_DOC_NUMBER ON HIS_PRESCRIPTIONS(PRES_DOC_NUMBER);

-- Laboratory relationships
CREATE INDEX IDX_LAB_PAT_NUMBER ON HIS_LABORATORY(LAB_PAT_NUMBER);
CREATE INDEX IDX_LAB_DOC_NUMBER ON HIS_LABORATORY(LAB_DOC_NUMBER);

-- Vitals relationship
CREATE INDEX IDX_VIT_PAT_NUMBER ON HIS_VITALS(VIT_PAT_NUMBER);

-- Surgery relationship
CREATE INDEX IDX_SURG_PAT_NUMBER ON HIS_SURGERY(SURG_PAT_NUMBER);
```

### Join Optimization Strategies

1. **Indexed Foreign Keys**: All foreign key columns have indexes for faster joins
2. **Selective WHERE Clauses**: Filter early to reduce join dataset size
3. **Appropriate Join Types**: Use INNER JOIN when both sides required, LEFT JOIN when optional
4. **Column Selection**: SELECT only needed columns, not `SELECT *`
5. **Unique Constraints**: Natural keys (e.g., DOC_NUMBER, PAT_NUMBER) have unique indexes

### Query Performance Tips

```sql
-- ✅ GOOD: Indexed join with filter
SELECT p.PAT_NAME, d.DOC_NAME
FROM HIS_PATIENTS p
INNER JOIN HIS_DOCS d ON p.PAT_ASSIGNED_DOC = d.DOC_NUMBER
WHERE p.PAT_TYPE = 'InPatient';

-- ❌ BAD: Unindexed column join
SELECT p.PAT_NAME, d.DOC_NAME
FROM HIS_PATIENTS p
INNER JOIN HIS_DOCS d ON p.PAT_FNAME = d.DOC_FNAME;  -- Not indexed!
```

---

## Benefits of This Normalized Design

### 1. Data Integrity
- ✅ No duplicate patient/doctor information
- ✅ Foreign keys ensure valid references
- ✅ Cascading deletes maintain consistency

### 2. Flexibility
- ✅ Easy to add new relationships (e.g., multiple doctors per patient)
- ✅ Can extend tables without affecting others
- ✅ Support for complex queries via joins

### 3. Storage Efficiency
- ✅ Minimal redundancy
- ✅ Vendor details stored once, referenced many times
- ✅ Doctor information not duplicated across patient records

### 4. Maintainability
- ✅ Update doctor email once, reflects everywhere
- ✅ Clear table relationships
- ✅ Easy to understand schema

### 5. Query Performance
- ✅ Indexed foreign keys
- ✅ Optimized join paths
- ✅ Efficient data retrieval

---

## Conclusion

The Hospital Management System database is designed with **full Third Normal Form (3NF) compliance**, ensuring:
- No redundant data storage
- Strong referential integrity through foreign keys
- Efficient querying through strategic use of INNER and LEFT JOINs
- Scalability for future enhancements
- Performance optimization via indexed columns

This normalized structure provides a solid foundation for a robust, maintainable hospital management application with clear data relationships and efficient data access patterns.
