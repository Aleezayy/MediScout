import { KNOWN_DISEASES } from '@/lib/dataGenerators';

const MOCK_ADVICE = {
  "Febrile Illness (Suspected Vector-borne)": "High fever, body aches, and rash suggest a vector-borne illness like Dengue. Please consult a doctor immediately. Rest, stay hydrated, and monitor for warning signs like bleeding or severe abdominal pain.",
  "Mild Viral Infection": "Symptoms like mild fever and cough could be a common viral infection. Rest, drink plenty of fluids, and take over-the-counter medication for symptom relief if needed. If symptoms worsen or persist, see a doctor.",
  "Acute Diarrheal Disease": "Frequent loose stools and cramps indicate acute diarrhea. Stay hydrated with ORS (Oral Rehydration Salts) or clear fluids. Eat bland food. Seek medical attention if dehydration is severe, or if there's blood in stool or high fever.",
  "Suspected Tuberculosis (TB)": "Persistent cough, fever, night sweats, and weight loss are serious symptoms that could indicate TB. It's crucial to see a doctor for testing (like a sputum test or chest X-ray) and treatment. TB is curable with proper medication.",
  "Obstetric Complication (e.g., Suspected Preeclampsia)": "Severe headache, blurred vision, and abdominal pain during pregnancy can be signs of preeclampsia, a serious condition. Go to the nearest hospital or clinic immediately for evaluation. Do not delay.",
  "Hypertension": "Elevated blood pressure needs management. Consult a doctor for lifestyle advice (diet, exercise) and possible medication. Monitor your blood pressure regularly.",
  "Diabetes Mellitus": "Symptoms like increased thirst, frequent urination, and fatigue suggest diabetes. See a doctor for blood sugar testing and management plan, which may include diet, exercise, and medication.",
  "Acute Respiratory Infection (ARI)": "Cough, difficulty breathing, and fever could be an ARI. Rest, stay hydrated. For children, monitor for fast breathing or chest indrawing, and seek urgent care if present. Adults should see a doctor if symptoms are severe or don't improve.",
  "Default": "Your symptoms require a general check-up. Please consult a healthcare professional for accurate diagnosis and advice. Maintain good hygiene and a healthy lifestyle.",
};


export const getSimulatedAiPrediction = async (symptoms, imageFile) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerSymptoms = symptoms.toLowerCase();
      let predictedCondition = "General Checkup";
      let highestMatchCount = 0;

      KNOWN_DISEASES.forEach(disease => {
        let matchCount = 0;
        const diseaseKeywords = disease.toLowerCase().replace(/\(.*?\)/g, '').split(' ');
        
        diseaseKeywords.forEach(keyword => {
          if (keyword.length > 2 && lowerSymptoms.includes(keyword)) {
            matchCount++;
          }
        });

        if (lowerSymptoms.includes("fever") && (disease.includes("Febrile") || disease.includes("Dengue"))) matchCount += 2;
        if (lowerSymptoms.includes("cough") && (disease.includes("TB") || disease.includes("Respiratory"))) matchCount +=2;
        if ((lowerSymptoms.includes("diarrhea") || lowerSymptoms.includes("loose motion")) && disease.includes("Diarrheal")) matchCount +=2;
        if ((lowerSymptoms.includes("rash") || (imageFile && imageFile.name.match(/\.(jpeg|jpg|png)$/i))) && disease.includes("Dengue")) matchCount +=1;


        if (matchCount > highestMatchCount) {
          highestMatchCount = matchCount;
          predictedCondition = disease;
        }
      });
      
      // Fallback to a general condition if no strong match
      if (highestMatchCount < 1 && predictedCondition === "General Checkup") {
         if (lowerSymptoms.includes("fever")) predictedCondition = "Febrile Illness (Suspected Vector-borne)";
         else if (lowerSymptoms.includes("cough")) predictedCondition = "Acute Respiratory Infection (ARI)";
         else if (lowerSymptoms.includes("pain")) predictedCondition = "General Checkup"; // Could be anything
      }


      const advice = MOCK_ADVICE[predictedCondition] || MOCK_ADVICE["Default"];
      
      resolve({
        prediction: predictedCondition,
        advice: advice,
        confidence: Math.min(0.95, highestMatchCount * 0.15 + 0.4).toFixed(2), // Simulated confidence
        imageAnalysis: imageFile ? `Simulated analysis of ${imageFile.name}: Possible signs consistent with ${predictedCondition.split('(')[0].trim()}.` : "No image submitted for analysis."
      });
    }, 1500); // Simulate API call delay
  });
};