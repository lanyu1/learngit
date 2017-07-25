/*1.查询hire_date在1997年之后的员工所有信息
     SELECT * FROM employees WHERE hire_date > TO_DATE('01-Jan-97', 'DD-Mon-RR');
查询员工的last_name,job_id,salary.commission_pct并且按照salary的降序排列，且commission_pct不为空的所有员工
 2.select last_name,job_id,salary,commission_pct from employees where commission_pct is not null order by salary desc;
查询出last_name与salary*1.1的员工工资并且commission_pct为0;
3.select 'The salary of '||last_name||' after a 10% raise'||salary*1.1 from employees where commission_pct is null;
4.select last_name,Round((sysdate-hire_date)/365)asYears,months_between(sysdate,to_date(hire_date)) as Month from employees;
5.select last_name from employees where last_name like'M%' or last_name like'K%' or last_name like'J%' or last_name like'L%';
6.selectlast_name,salarycommission_pct,NVL2(commission_pct,'YES','NO')income from employees;
7.select  d.department_name,d.location_id,e.last_name,e.job_id,e.salary from employees e,departments d where e.department_id=d.department_id  and d.location_id=1800;
8.select count(*) from employees where substr(first_name,-1)='n';
9.select d.department_id,d.department_name,d.location_id,count(e.employee_id) from departments d,employees e where e.department_id=d.department_id group by d.department_id,d.department_name,d.location_id order by d.department_id asc;
10.select job_id from employees where department_id in(10,20);
12.select last_name,hire_date from employees where to_number(to_char(hire_date,'mm'))<=3 ;
13.select last_name,salary,Round(salary/1000) as thuousands from employees;
14.select e.last_name,e.salary,j.grade_level from employees e,job_grades j 
where e.salary between j.lowest_sal and j.highest_sal and j.grade_level='E';
15.SELECT  d.department_id, d.department_name,
        count(e1.employee_id) employees,
        NVL(TO_CHAR(AVG(e1.salary), '99999.99'),
        'No average' ) avg_sal,
        e2.last_name, e2.salary, e2.job_id
FROM    departments d, employees e1, employees e2
WHERE   d.department_id = e1.department_id(+)
AND     d.department_id = e2.department_id(+)
GROUP BY d.department_id, d.department_name,
         e2.last_name,   e2.salary, e2.job_id
ORDER BY d.department_id, employees
16.select department_id,MIN(salary) from employees 
where department_id=90
group by department_id;
17.select  DISTINCT department_id,department_name,manager_id,location_id from departments ORDER BY department_id;
18.1.select e.department_id,d.department_name,COUNT(e.employee_id) from employees e,departments d 
where e.department_id=d.department_id
group by e.department_id,d.department_name
HAVING COUNT(e.employee_id)<3
order by e.department_id asc;
select MAX(COUNT(employee_id))from employees
group by department_id;
18.2.select e.department_id,d.department_name,COUNT(e.employee_id) from employees e,departments d 
where e.department_id=d.department_id
group by e.department_id,d.department_name
HAVING COUNT(employee_id)=(select MAX(COUNT(employee_id))from employees group by department_id)
order by e.department_id asc;
18.3.select e.department_id,d.department_name,COUNT(e.employee_id) from employees e,departments d 
where e.department_id=d.department_id
group by e.department_id,d.department_name
HAVING COUNT(employee_id)=(select MIN(COUNT(employee_id))from employees group by department_id)
order by e.department_id asc;
19.SELECT x.employee_id,x.last_name,y.department_id,avg(y.salary)
FROM employees x,employees y
WHERE x.department_id is not null and x.department_id = y.department_id
group by x.employee_id,x.last_name,y.department_id
order by employee_id asc;
20.select e.last_name,MAX(to_char(hire_date,'Day')) from employees e
group by e.last_name
HAVING MAX(to_char(hire_date,'Day'))=(select MAX(TO_CHAR(HIRE_DATE,'Day')) from employees);
21.select last_name,to_char(hire_date,'MonthfmDD') AS hire_date from employees;
22.select job_id from employees where hire_date between '01-JAN-1991' AND '30-JUN-1991';
23.select employee_id,salary,
case department_id 
when 10 then 0.05*salary
when 50 then 0.05*salary   
when 110 then 0.05*salary   
when 60 then 0.1*salary   
when 20 then 0.15*salary  
when 80 then 0.15*salary   
else salary*0
end "new_salary" from employees;
25.a.select TZ_OFFSET ('Australia/Sydney') from employees; 
25.b.select TZ_OFFSET ('Chile/EasterIsland') from employees;
26.SELECT last_name, extract (MONTH FROM HIRE_DATE),HIRE_DATE
FROM employees
WHERE extract (MONTH FROM HIRE_DATE) = 1; 
27.SELECT   l.city,d.department_name, e.job_id, SUM(e.salary)
FROM     locations l,employees e,departments d
WHERE    d.location_id = l.location_id
AND      e.department_id = d.department_id
AND      e.department_id > 80
GROUP    BY CUBE( l.city,d.department_name, e.job_id);
28.select department_id, job_id, manager_id,max(salary),min(salary)
from   employees
group by grouping sets
((department_id,job_id), (job_id,manager_id))
29.select last_name, salary
from   employees e
where  3  >  (select COUNT(*)
        from   employees
        where  e.salary < salary);
30.select employee_id, last_name
from employees e
 where ((select location_id
          from departments d
          where e.department_id = d.department_id )
          in   (select location_id
                from locations l
                where STATE_province =
               'California') );
31.DELETE FROM job_history JH
WHERE employee_id =
  (SELECT employee_id 
   FROM employees E
   WHERE JH.employee_id = E.employee_id
         AND START_DATE = (SELECT MIN(start_date)  
            FROM job_history JH
       WHERE JH.employee_id = E.employee_id)
   AND 3 >  (SELECT COUNT(*)  
            FROM job_history JH
       WHERE JH.employee_id = E.employee_id
      GROUP BY EMPLOYEE_ID
      HAVING COUNT(*) >= 2));
32.ROLLBACK;
33.WITH 
MAX_SAL_CALC AS (
  SELECT job_title, MAX(salary) AS job_total
  FROM employees, jobs
  WHERE employees.job_id = jobs.job_id
  GROUP BY job_title)
SELECT job_title, job_total
FROM MAX_SAL_CALC
WHERE job_total > (
                    SELECT MAX(job_total) * 1/2
                    FROM MAX_SAL_CALC)
ORDER BY job_total DESC; 
34.a.select employee_id, last_name, hire_date, salary
FROM   employees
where  manager_id = (select employee_id
           from   employees
             where last_name = 'De Haan');
34.b.select employee_id, last_name, hire_date, salary
from   employees
where  employee_id != 102
connect by manager_id = PRIOR employee_id
start with employee_id = 102;
35.select employee_id, manager_id, level, last_name
from   employees
where level = 3
connect by manager_id = PRIOR employee_id
start with employee_id= 102;
36.SELECT  employee_id, manager_id, LEVEL,
LPAD(last_name, LENGTH(last_name)+(LEVEL*2)-2,'_')  LAST_NAME        
FROM    employees
CONNECT BY employee_id = PRIOR manager_id;
37.INSERT ALL
WHEN SAL < 5000 THEN
INTO  special_sal VALUES (EMPID, SAL)
ELSE
INTO sal_history VALUES(EMPID,HIREDATE,SAL)
INTO mgr_history VALUES(EMPID,MGR,SAL)   
SELECT employee_id EMPID, hire_date HIREDATE,
       salary SAL, manager_id MGR
FROM employees
WHERE employee_id >=200;
39.CREATE TABLE LOCATIONS_NAMED_INDEX
 (location_id NUMBER(4)
         PRIMARY KEY USING INDEX
        (CREATE INDEX locations_pk_idx ON
         LOCATIONS_NAMED_INDEX(location_id)),
location_name VARCHAR2(20));
40.SELECT INDEX_NAME, TABLE_NAME
FROM USER_INDEXES
WHERE TABLE_NAME = 'LOCATIONS_NAMED_INDEX';*/
