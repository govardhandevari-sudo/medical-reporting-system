DROP TABLE IF EXISTS doctor_referal;
CREATE TABLE doctor_referal (
  DoctorID INT AUTO_INCREMENT PRIMARY KEY,
  DoctorName VARCHAR(255),
  Mobile VARCHAR(20),
  Email VARCHAR(255),
  CityID INT,
  CentreID INT,
  IsActive TINYINT
);

INSERT INTO doctor_referal (DoctorName,Mobile,Email,IsActive)
VALUES 
('Dr. Ramesh Kumar','9999988888','ramesh@example.com',1),
('Dr. Priya Sharma','9999977777','priya@example.com',1),
('Dr. Asha Patel','8888899999','asha@example.com',1);

DROP TABLE IF EXISTS patient_labinvestigation_opd;
CREATE TABLE patient_labinvestigation_opd (
  LabInvestigationID BIGINT AUTO_INCREMENT PRIMARY KEY,
  PatientID BIGINT,
  InvestigationID INT,
  CentreID INT,
  DoctorID INT,
  ResultDate DATE,
  Amount DECIMAL(10,2)
);

INSERT INTO patient_labinvestigation_opd (PatientID,InvestigationID,CentreID,DoctorID,ResultDate,Amount)
VALUES 
(1,1,1,1,'2025-12-01',500),
(2,2,1,1,'2025-12-03',800),
(3,3,1,2,'2025-12-02',600),
(4,1,1,3,'2025-12-04',1000),
(5,2,1,3,'2025-12-05',1200);
