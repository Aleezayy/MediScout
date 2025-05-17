import { generateAllAssumptionData } from './assumptionBasedData';

const SYNTHETIC_DATA_KEY = 'syntheticHealthData_v2'; // Changed key for fresh data with new structure

export const getSyntheticData = () => {
  const cachedData = localStorage.getItem(SYNTHETIC_DATA_KEY);
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      // Basic validation if data structure changed significantly
      if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].id && parsedData[0].vitals) {
        return parsedData;
      } else {
        localStorage.removeItem(SYNTHETIC_DATA_KEY); // Clear malformed/old data
      }
    } catch (e) {
      localStorage.removeItem(SYNTHETIC_DATA_KEY);
    }
  }
  const newData = generateAllAssumptionData();
  localStorage.setItem(SYNTHETIC_DATA_KEY, JSON.stringify(newData));
  return newData;
};

export const regenerateSyntheticData = () => {
  localStorage.removeItem(SYNTHETIC_DATA_KEY);
  return getSyntheticData();
};

export const exportDataToCSV = (data) => {
  if (!data || data.length === 0) {
    return;
  }

  const replacer = (key, value) => value === null ? '' : value; 
  const header = Object.keys(data[0]);
  
  const flatHeader = [];
  header.forEach(col => {
    if (typeof data[0][col] === 'object' && data[0][col] !== null) {
      if (col === 'vitals') {
        Object.keys(data[0].vitals).forEach(vk => flatHeader.push(`vitals_${vk}`));
      } else if (col === 'simulatedAiImageAnalysis') {
         Object.keys(data[0].simulatedAiImageAnalysis).forEach(aik => flatHeader.push(`aiImage_${aik}`));
      } else {
         flatHeader.push(col); // keep other objects as stringified JSON for simplicity
      }
    } else {
      flatHeader.push(col);
    }
  });

  let csv = data.map(row => 
    flatHeader.map(fieldName => {
      let cellValue;
      if (fieldName.startsWith('vitals_')) {
        cellValue = row.vitals ? row.vitals[fieldName.replace('vitals_', '')] : '';
      } else if (fieldName.startsWith('aiImage_')) {
        cellValue = row.simulatedAiImageAnalysis ? row.simulatedAiImageAnalysis[fieldName.replace('aiImage_', '')] : '';
      } else if (typeof row[fieldName] === 'object' && row[fieldName] !== null) {
        cellValue = JSON.stringify(row[fieldName]); // stringify other objects
      }
       else {
        cellValue = row[fieldName];
      }
      return JSON.stringify(cellValue, replacer);
    }).join(',')
  );

  csv.unshift(flatHeader.join(','));
  csv = csv.join('\\r\\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mediscout_synthetic_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};