CREATE TABLE IF NOT EXISTS department (
  deptCode    VARCHAR(3)  PRIMARY KEY,
  deptName    VARCHAR(20),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS job (
  jobCode     VARCHAR(4)  PRIMARY KEY,
  jobDesc     VARCHAR(20),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS employee (
  empno       VARCHAR(5)  PRIMARY KEY,
  lastname    VARCHAR(15),
  firstname   VARCHAR(15),
  gender      CHAR(1)     CHECK (gender IN ('M','F')),
  birthdate   DATE,
  hiredate    DATE,
  sepDate     DATE,
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS jobHistory (
  empNo       VARCHAR(5)  REFERENCES employee(empno),
  jobCode     VARCHAR(4)  REFERENCES job(jobCode),
  effDate     DATE,
  salary      DECIMAL(10,2) CHECK (salary >= 0),
  deptCode    VARCHAR(3)  REFERENCES department(deptCode),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60),
  PRIMARY KEY (empNo, jobCode, effDate)
);