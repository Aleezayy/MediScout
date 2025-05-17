export const LOCATIONS = ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Gujranwala', 'Peshawar', 'Quetta', 'Islamabad'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const KNOWN_DISEASES = [
  'Febrile Illness (Suspected Vector-borne)',
  'Mild Viral Infection',
  'Acute Diarrheal Disease',
  'Healthy Child Checkup',
  'Nutritional Assessment (Possible Stunting)',
  'Routine Child Checkup',
  'Nutritional Assessment (Possible Wasting)',
  'Suspected Tuberculosis (TB)',
  'Obstetric Complication (e.g., Suspected Preeclampsia)',
  'Routine Antenatal Care',
  'General Adult Female Checkup',
  'Hypertension',
  'Normotensive Adult',
  'Diabetes Mellitus',
  'Non-Diabetic Adult',
  'Immunization Status Check',
  'Acute Respiratory Infection (ARI)',
  'Healthy Child',
  'General Checkup'
];


export const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const generatePatientRecord = (baseData) => {
  const age = baseData.age !== undefined ? baseData.age : getRandomInt(0, 80);
  let gender = baseData.gender !== undefined ? baseData.gender : getRandomElement(GENDERS);
  if (baseData.conditionAssigned === 'Obstetric Complications' && gender !== 'Female') {
    gender = 'Female';
  }
  
  return {
    id: generateId(),
    date: new Date(Date.now() - getRandomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    age,
    gender,
    location: getRandomElement(LOCATIONS),
    symptomsText: '',
    vitals: {
      temperature: getRandomFloat(36.0, 37.5, 1), 
      bloodPressure: `${getRandomInt(90, 140)}/${getRandomInt(60, 90)}`, 
      heartRate: getRandomInt(60, 100), 
      respiratoryRate: getRandomInt(12, 20), 
    },
    imagePlaceholder: 'No specific image noted.',
    conditionAssigned: 'General Checkup',
    simulatedRiskScore: getRandomInt(1, 3), 
    simulatedAiTriageCategory: 'Non-urgent',
    simulatedAiImageAnalysis: {
      finding: 'N/A',
      confidence: 0,
    },
    ...baseData,
  };
};