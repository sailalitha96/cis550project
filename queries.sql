-- 1a) State drop-down:
SELECT DISTINCT(StateCode) FROM network ORDER BY StateCode;
--1b) Age drop-down:
SELECT* FROM agecolumn;

--Display Network Names for a state code:
WITH R1 AS
(SELECT
DISTINCT(network.IssuerId) AS IssuerId,
network.NetworkName AS Network
FROM network
WHERE network.StateCode LIKE '%TN%'
AND network.DentalOnlyPlan LIKE '%No%'
GROUP BY network.IssuerId),
R2 AS
 (SELECT R1.IssuerId, R1.Network, COUNT(DISTINCT(PlanId)) AS NumPlans
FROM rate JOIN R1 ON rate.IssuerId = R1.IssuerId
GROUP BY R1.IssuerId)
SELECT
R2.IssuerId AS IssuerId,
R2.Network AS NetworkName,
R2.NumPlans AS NumPlans,
COALESCE(1-quality.Claims_Denials/(quality.Claims_Received+quality.Claims_Denials),'NA') AS quality_index
FROM R2 LEFT JOIN quality ON R2.IssuerId = quality.Issuer_ID
GROUP BY R2.IssuerId
ORDER BY NumPlans DESC, quality_index DESC;


--Display for a selected issuer ID the Number of plans, average premium, average copay, average coinsurance (overall plans)
WITH R1 AS
(SELECT DISTINCT(planid) AS plans, AVG(IndividualRate_1+IndividualRate_2+IndividualRate_3) AS Premium
FROM rate
WHERE issuerid = 22444
AND Age LIKE '%23%'
GROUP BY PlanId),
R2 AS
(SELECT R1.plans as plans,SUM(bcs.CopayInnTier1) AS Copay,
SUM(bcs.CoinsInnTier1) AS CoInsurance ,SUM(bcs.CopayOutofNet) AS CopayOut,SUM( bcs.CoinsOutofNet) AS CoinsOut
FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId
GROUP BY bcs.StandardComponentId , bcs.BenefitName)
SELECT
ROUND(AVG(R1.Premium),2) AS Avg_Premium,
ROUND(AVG(R2.Copay),2) AS Avg_Copay,
ROUND(AVG(R2.CoInsurance),2) AS Avg_CoInsurance
FROM R1,R2;

--Display distinct metal levels associated with an issuer id (to fetch the metal levels for the front end card) :
SELECT
DISTINCT(planidcrosswalk.MetalLevel_2018) AS MetalLevel
FROM planidcrosswalk
WHERE IssuerId_2018=82120 ;

Display for a selected issuer ID the average premium, copay, coinsurance, out of network pay of plans grouped by metal levels (including all plans within an issuer ID). (72593 : ~3.97sec Indexing (PlanId) , 16322: ~3.8 sec Indexing (PlanId))
WITH R1 AS
(SELECT DISTINCT(planid) AS plans, AVG(IndividualRate_1+IndividualRate_2+IndividualRate_3) AS Premium
FROM rate
WHERE issuerid = 21535
AND Age LIKE '%23%'
GROUP BY PlanId),
R2 AS
(SELECT R1.plans as plans,SUM(bcs.CopayInnTier1) AS Copay,
SUM(bcs.CoinsInnTier1) AS CoInsurance ,SUM(bcs.CopayOutofNet) AS CopayOut,SUM( bcs.CoinsOutofNet) AS CoinsOut, R1.Premium AS Premium
FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId
GROUP BY bcs.StandardComponentId , bcs.BenefitName),
R3 AS
(SELECT DISTINCT(R1.plans) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1
ON pcw.PlanID_2018 = R1.plans)
SELECT
R3.MetalLevel AS MetalLevel,
ROUND(AVG(R2.Premium),2) AS AvgPremium,
AVG(R2.Copay) AS AvgCopay ,
AVG(R2.CoInsurance) AS AvgCoInsurance  ,
AVG(R2.CopayOut) AS AvgCopayOut ,
AVG(R2.CoinsOut ) AS AvgCoinsOut
FROM R2 JOIN R3 ON R2.Plans = R3.Plans
GROUP BY R3.MetalLevel
ORDER BY AvgPremium;

--Display top 10 Benefit Names across all metal levels for a given IssuerID: [16322: ~ 0.65 sec Indexing (PlanId)]
WITH R1 AS  (SELECT DISTINCT(planid) AS plans
FROM rate  WHERE issuerid = 11512 AND Age LIKE '%23%'  GROUP BY PlanId),
R2 AS  (SELECT DISTINCT(R1.plans) as plans,(bcs.BenefitName) AS Benefits FROM bcs  JOIN R1 ON R1.plans = bcs.StandardComponentId) ,
R3 AS
(SELECT DISTINCT(R1.plans) AS plans, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1
ON pcw.PlanID_2018 = R1.plans)
 SELECT
R2.Benefits AS Benefits
FROM R2 JOIN R3 ON R2.Plans = R3.Plans
GROUP BY Benefits ORDER BY COUNT(DISTINCT(R3.MetalLevel)) DESC LIMIT 10;

--Find the out of service area  and out of country coverage plans for  a selected issuer Id grouped by metal level (from attributes table)
WITH R1 AS
(SELECT DISTINCT(PlanId) AS Plan FROM rate WHERE IssuerId = 11512 AND Age LIKE '%23%'),

R2  AS
(SELECT DISTINCT(R1.Plan) as Plan, pcw.MetalLevel_2018 AS MetalLevel FROM planidcrosswalk pcw JOIN R1
ON pcw.PlanID_2018 = R1.Plan),
R3 AS
(SELECT r.MetalLevel as MetalLevel,Count(p.OutOfServiceAreaCoverage) as AreaCoverage, Count(OutOfCountryCoverage) AS CountryCoverage  , Count(DISTINCT(StandardComponentId)) as plans ,Count(DISTINCT(PlanId)) as num_var
 FROM attributes p JOIN R2  r ON p.StandardComponentId = r.Plan  AND p.OutOfServiceAreaCoverage LIKE '%Yes%'
AND p.OutOfCountryCoverage LIKE '%Yes%'
GROUP by r.MetalLevel),
R4 AS
(Select Count(R2.Plan) as num_plans, R2.Metallevel
FROM R2
GROUP BY R2.MetalLevel )

	SELECT
DISTINCT R4.MetalLevel,
COALESCE(ROUND(R3.plans/(R4.num_plans),2),0) AS AreaandCountryCoverage
FROM R3 RIGHT OUTER JOIN R4 ON R3.MetalLevel = R4.MetalLevel;

--Ranking by Death Rate-
SELECT State FROM stats
WHERE state != 'USA'
ORDER BY Death_Rate/1000000;

--Ranking by Income-
SELECT State FROM stats
WHERE state != 'USA'
ORDER BY Annual_Income/1000000;

--Ranking by Insured People-
SELECT State FROM stats
WHERE state != 'USA'
ORDER BY 1-Uninsured/Total;

--Calculate savings
SELECT
(Annual_Income - Average_Premium-HousingRent) FROM
stats WHERE State LIKE ‘%AK%’

--Calculating rank based on premium and deductible :
WITH R1 AS
(SELECT DISTINCT(network.IssuerId) AS IssuerId
FROM network
WHERE network.StateCode LIKE '%AR%'
AND network.DentalOnlyPlan LIKE '%No%'
GROUP BY network.IssuerId) ,
R2 AS
(SELECT DISTINCT(planid) AS plans, AVG(IndividualRate_1+IndividualRate_2+IndividualRate_3) AS Premium
FROM rate
JOIN R1 ON R1.IssuerId = rate.IssuerId
AND Age LIKE '%23%'
GROUP BY PlanId),
R3 AS
(SELECT R2.plans as plans,SUM(bcs.CopayInnTier1) AS Copay,
SUM(bcs.CoinsInnTier1) AS CoInsurance , R2.Premium AS Premium
FROM bcs  JOIN R2 ON R2.plans = bcs.StandardComponentId
GROUP BY bcs.StandardComponentId , bcs.BenefitName)
SELECT
(0.8* AVG(R3.Premium)+
0.18*AVG(R3.Copay) +
0.02* AVG(R3.CoInsurance) ) As total_pay
FROM R2 JOIN R3 ON R2.Plans = R3.Plans;
