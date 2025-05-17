import { generatePatientRecord, getRandomFloat, getRandomInt } from './dataGenerators';

const createFebrileIllnessRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const isFebrile = Math.random() < 0.25;
    records.push(generatePatientRecord({
      vitals: {
        temperature: isFebrile ? getRandomFloat(38.0, 40.5, 1) : getRandomFloat(36.5, 37.5, 1),
        bloodPressure: `${getRandomInt(90, 130)}/${getRandomInt(60, 85)}`,
        heartRate: isFebrile ? getRandomInt(90, 120) : getRandomInt(60, 100),
      },
      symptomsText: isFebrile ? 'High fever, headache, body aches, chills. Possible skin rash.' : 'General weakness, mild cough.',
      imagePlaceholder: isFebrile ? 'Photo of patient appearing flushed, possible faint rash on arm.' : 'General observation photo.',
      conditionAssigned: isFebrile ? 'Febrile Illness (Suspected Vector-borne)' : 'Mild Viral Infection',
      simulatedRiskScore: isFebrile ? getRandomInt(6, 9) : getRandomInt(2, 4),
      simulatedAiTriageCategory: isFebrile ? 'Vector-borne / Infectious Disease' : 'General Acute',
      simulatedAiImageAnalysis: isFebrile && Math.random() < 0.3 ? { finding: 'Possible Dengue Rash', confidence: getRandomFloat(0.6, 0.85, 2) } : { finding: 'N/A', confidence: 0 },
    }));
  }
  return records;
};

const createDiarrhealDiseaseRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(0, 4);
    const hasDiarrhea = Math.random() < 0.39;
    records.push(generatePatientRecord({
      age,
      symptomsText: hasDiarrhea ? 'Multiple loose stools per day, abdominal cramps, dehydration signs.' : 'Normal bowel movements, playful.',
      imagePlaceholder: hasDiarrhea ? 'Photo showing signs of dehydration (e.g., sunken eyes).' : 'Child playing.',
      conditionAssigned: hasDiarrhea ? 'Acute Diarrheal Disease' : 'Healthy Child Checkup',
      simulatedRiskScore: hasDiarrhea ? getRandomInt(5, 8) : getRandomInt(1, 3),
      simulatedAiTriageCategory: hasDiarrhea ? 'Gastrointestinal / Pediatric' : 'Pediatric Wellness',
      vitals: {
        temperature: hasDiarrhea ? getRandomFloat(37.0, 38.5, 1) : getRandomFloat(36.5, 37.2, 1),
      }
    }));
  }
  return records;
};

const createStuntingRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(1, 4);
    const isStunted = Math.random() < 0.38;
    records.push(generatePatientRecord({
      age,
      symptomsText: isStunted ? 'Appears small for age, recurrent minor illnesses.' : 'Normal growth observed, active.',
      conditionAssigned: isStunted ? 'Nutritional Assessment (Possible Stunting)' : 'Routine Child Checkup',
      simulatedRiskScore: isStunted ? getRandomInt(3, 6) : getRandomInt(1, 2),
      simulatedAiTriageCategory: isStunted ? 'Nutritional / Pediatric Chronic' : 'Pediatric Wellness',
      imagePlaceholder: isStunted ? 'Full body photo for growth assessment.' : 'Child smiling.',
    }));
  }
  return records;
};

const createWastingRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(0, 4);
    const isWasted = Math.random() < 0.177;
    records.push(generatePatientRecord({
      age,
      symptomsText: isWasted ? 'Appears very thin, low energy, poor appetite.' : 'Healthy weight, energetic.',
      conditionAssigned: isWasted ? 'Nutritional Assessment (Possible Wasting)' : 'Routine Child Checkup',
      simulatedRiskScore: isWasted ? getRandomInt(6, 9) : getRandomInt(1, 2),
      simulatedAiTriageCategory: isWasted ? 'Nutritional Emergency / Pediatric Acute' : 'Pediatric Wellness',
      imagePlaceholder: isWasted ? 'Photo showing thin limbs and visible ribs.' : 'Child engaged in activity.',
    }));
  }
  return records;
};

const createTuberculosisRecords = (count, totalRecordsTarget) => {
  const records = [];
  const tbCases = Math.max(1, Math.round(count * (259 / 100000) * (totalRecordsTarget / count * 5))); 
  for (let i = 0; i < tbCases; i++) {
     records.push(generatePatientRecord({
      age: getRandomInt(15, 65),
      symptomsText: 'Persistent cough for >2 weeks, fever, night sweats, weight loss, chest pain.',
      imagePlaceholder: 'Chest X-ray placeholder or photo of patient looking unwell.',
      conditionAssigned: 'Suspected Tuberculosis (TB)',
      simulatedRiskScore: getRandomInt(7, 10),
      simulatedAiTriageCategory: 'Respiratory / Infectious Disease Chronic',
      simulatedAiImageAnalysis: Math.random() < 0.4 ? { finding: 'Possible Lung Infiltrates (X-Ray simulation)', confidence: getRandomFloat(0.65, 0.9, 2) } : { finding: 'N/A', confidence: 0 },
      vitals: {
        temperature: getRandomFloat(37.5, 38.8, 1),
        respiratoryRate: getRandomInt(20, 28),
      }
    }));
  }
  return records;
};

const createObstetricComplicationRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const isPregnantAndComplicated = Math.random() < 0.10;
    if (isPregnantAndComplicated) {
      records.push(generatePatientRecord({
        age: getRandomInt(18, 40),
        gender: 'Female',
        symptomsText: 'Pregnant. Experiencing severe headache, blurred vision, abdominal pain, and swelling.',
        imagePlaceholder: 'Photo of pregnant woman, focus on facial swelling or discomfort.',
        conditionAssigned: 'Obstetric Complication (e.g., Suspected Preeclampsia)',
        simulatedRiskScore: getRandomInt(8, 10),
        simulatedAiTriageCategory: 'Maternal Health Emergency',
        vitals: {
            bloodPressure: `${getRandomInt(140, 180)}/${getRandomInt(90, 110)}`,
            temperature: getRandomFloat(36.5, 37.5, 1),
        }
      }));
    } else {
        records.push(generatePatientRecord({
            age: getRandomInt(18, 40),
            gender: 'Female',
            symptomsText: Math.random() < 0.3 ? 'Routine pregnancy checkup, mild fatigue.' : 'General checkup, no major complaints.',
            conditionAssigned: Math.random() < 0.3 ? 'Routine Antenatal Care' : 'General Adult Female Checkup',
            simulatedRiskScore: getRandomInt(1, 3),
            simulatedAiTriageCategory: Math.random() < 0.3 ? 'Maternal Health Wellness' : 'General Adult',
        }));
    }
  }
  return records;
};

const createHypertensionRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(18, 69);
    const hasHypertension = Math.random() < 0.373;
    records.push(generatePatientRecord({
      age,
      symptomsText: hasHypertension ? 'Occasional headaches, dizziness, chest discomfort. Often asymptomatic.' : 'Feeling well, no specific complaints.',
      vitals: {
        bloodPressure: hasHypertension ? `${getRandomInt(140, 180)}/${getRandomInt(90, 110)}` : `${getRandomInt(100, 125)}/${getRandomInt(65, 85)}`,
        heartRate: getRandomInt(60, 90),
      },
      conditionAssigned: hasHypertension ? 'Hypertension' : 'Normotensive Adult',
      simulatedRiskScore: hasHypertension ? getRandomInt(5, 8) : getRandomInt(1, 3),
      simulatedAiTriageCategory: hasHypertension ? 'Cardiovascular / Chronic Disease' : 'General Adult Wellness',
    }));
  }
  return records;
};

const createDiabetesRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(25, 70);
    const hasDiabetes = Math.random() < 0.314;
    records.push(generatePatientRecord({
      age,
      symptomsText: hasDiabetes ? 'Increased thirst, frequent urination, fatigue, blurred vision, slow healing wounds.' : 'No specific diabetic symptoms reported.',
      imagePlaceholder: hasDiabetes && Math.random() < 0.2 ? 'Photo of a foot ulcer or skin infection.' : 'General observation.',
      conditionAssigned: hasDiabetes ? 'Diabetes Mellitus' : 'Non-Diabetic Adult',
      simulatedRiskScore: hasDiabetes ? getRandomInt(6, 9) : getRandomInt(1, 3),
      simulatedAiTriageCategory: hasDiabetes ? 'Endocrine / Chronic Disease' : 'General Adult Wellness',
      simulatedAiImageAnalysis: hasDiabetes && Math.random() < 0.2 ? { finding: 'Possible Diabetic Foot Ulcer', confidence: getRandomFloat(0.7, 0.9, 2) } : { finding: 'N/A', confidence: 0 },
    }));
  }
  return records;
};

const createImmunizationRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const ageInMonths = getRandomInt(12, 23);
    const isFullyImmunized = Math.random() < 0.66;
    records.push(generatePatientRecord({
      age: Math.round(ageInMonths/12 * 10)/10, 
      symptomsText: `Child aged ${ageInMonths} months. Immunization status: ${isFullyImmunized ? 'Fully Immunized' : 'Partially or Not Immunized'}.`,
      conditionAssigned: 'Immunization Status Check',
      simulatedRiskScore: isFullyImmunized ? 1 : getRandomInt(3,5),
      simulatedAiTriageCategory: 'Pediatric Wellness / Preventive Health',
    }));
  }
  return records;
};

const createARIRecords = (count) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const age = getRandomInt(0, 4);
    const hasARI = Math.random() < 0.75;
    records.push(generatePatientRecord({
      age,
      symptomsText: hasARI ? 'Cough, difficulty breathing, fever, runny nose.' : 'No respiratory symptoms.',
      imagePlaceholder: hasARI ? 'Video/audio placeholder of child coughing or showing labored breathing.' : 'Child breathing normally.',
      conditionAssigned: hasARI ? 'Acute Respiratory Infection (ARI)' : 'Healthy Child',
      simulatedRiskScore: hasARI ? getRandomInt(4, 7) : getRandomInt(1, 2),
      simulatedAiTriageCategory: hasARI ? 'Respiratory / Pediatric Acute' : 'Pediatric Wellness',
      vitals: {
        temperature: hasARI ? getRandomFloat(37.5, 39.5, 1) : getRandomFloat(36.5, 37.2, 1),
        respiratoryRate: hasARI ? getRandomInt(30, 50) : getRandomInt(20, 30),
      }
    }));
  }
  return records;
};

export const generateAllAssumptionData = (numRecordsPerAssumption = 15) => {
  let allRecords = [];
  allRecords = allRecords.concat(createFebrileIllnessRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createDiarrhealDiseaseRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createStuntingRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createWastingRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createTuberculosisRecords(numRecordsPerAssumption, allRecords.length + numRecordsPerAssumption));
  allRecords = allRecords.concat(createObstetricComplicationRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createHypertensionRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createDiabetesRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createImmunizationRecords(numRecordsPerAssumption));
  allRecords = allRecords.concat(createARIRecords(numRecordsPerAssumption));
  
  allRecords.sort(() => Math.random() - 0.5);
  return allRecords.slice(0, 200); // Cap total records
};