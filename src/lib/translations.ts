export const translations = {
  appName: {
    en: 'Krishi-Sahayak',
    hi: 'कृषि-सहायक',
  },
  appSubtitle: {
    en: 'Your AI-powered farming assistant, providing smart solutions for modern agriculture.',
    hi: 'आपका एआई-संचालित कृषि सहायक, आधुनिक कृषि के लिए स्मार्ट समाधान प्रदान करता है।',
  },
  footer_rights: {
    en: 'All rights reserved.',
    hi: 'सर्वाधिकार सुरक्षित।',
  },
  loading_button: {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
  },
  error_title: {
    en: 'An error occurred',
    hi: 'एक त्रुटि हुई',
  },

  // Crop Recommendation
  crop_rec_title: {
    en: 'AI Crop Recommendation',
    hi: 'एआई फसल सिफारिश',
  },
  crop_rec_subtitle: {
    en: 'Get top 3 crop suggestions based on your land details.',
    hi: 'अपनी भूमि के विवरण के आधार पर शीर्ष 3 फसल सुझाव प्राप्त करें।',
  },
  crop_rec_soil_label: {
    en: 'Soil Type',
    hi: 'मिट्टी का प्रकार',
  },
  crop_rec_soil_placeholder: {
    en: 'e.g., Alluvial, Black',
    hi: 'जैसे, जलोढ़, काली',
  },
  crop_rec_soil_validation: {
    en: 'Soil type must be at least 2 characters.',
    hi: 'मिट्टी का प्रकार कम से कम 2 अक्षर का होना चाहिए।',
  },
  crop_rec_area_label: {
    en: 'Area (in acres)',
    hi: 'क्षेत्र (एकड़ में)',
  },
  crop_rec_area_placeholder: {
    en: 'e.g., 10',
    hi: 'जैसे, 10',
  },
  crop_rec_area_validation: {
    en: 'Area must be a positive number.',
    hi: 'क्षेत्र एक सकारात्मक संख्या होनी चाहिए।',
  },
  crop_rec_prev_crop_label: {
    en: 'Previous Crop',
    hi: 'पिछली फसल',
  },
  crop_rec_prev_crop_placeholder: {
    en: 'e.g., Wheat',
    hi: 'जैसे, गेहूँ',
  },
  crop_rec_prev_crop_validation: {
    en: 'Previous crop must be at least 2 characters.',
    hi: 'पिछली फसल कम से कम 2 अक्षर की होनी चाहिए।',
  },
  crop_rec_button: {
    en: 'Get Recommendations',
    hi: 'सिफारिशें प्राप्त करें',
  },
  crop_rec_results_title: {
    en: 'Top Recommendations',
    hi: 'शीर्ष सिफारिशें',
  },
  crop_rec_error: {
    en: 'Could not fetch crop recommendations. Please try again.',
    hi: 'फसल सिफारिशें प्राप्त नहीं की जा सकीं। कृपया पुन: प्रयास करें।',
  },

  // Disease Detection
  disease_detection_title: {
    en: 'AI Disease Detection',
    hi: 'एआई रोग पहचान',
  },
  disease_detection_subtitle: {
    en: 'Upload a photo and describe symptoms to identify crop diseases.',
    hi: 'फसल रोगों की पहचान के लिए एक फोटो अपलोड करें और लक्षणों का वर्णन करें।',
  },
  disease_image_label: {
    en: 'Crop Photo',
    hi: 'फसल का फोटो',
  },
  disease_image_placeholder: {
    en: 'Click to upload an image',
    hi: 'एक छवि अपलोड करने के लिए क्लिक करें',
  },
  disease_image_size_error: {
    en: 'Image size cannot exceed 4MB.',
    hi: 'छवि का आकार 4MB से अधिक नहीं हो सकता।',
  },
  disease_image_upload_error: {
    en: 'Please upload an image of the crop.',
    hi: 'कृपया फसल की एक छवि अपलोड करें।',
  },
  disease_symptoms_label: {
    en: 'Symptoms',
    hi: 'लक्षण',
  },
  disease_symptoms_placeholder: {
    en: 'Describe the symptoms you see on the crop, or use the mic for voice input.',
    hi: 'फसल पर दिखाई देने वाले लक्षणों का वर्णन करें, या वॉयस इनपुट के लिए माइक का उपयोग करें।',
  },
  disease_symptoms_validation: {
    en: 'Symptoms must be at least 10 characters.',
    hi: 'लक्षण कम से कम 10 अक्षर के होने चाहिए।',
  },
  disease_analyze_button: {
    en: 'Analyze Disease',
    hi: 'रोग का विश्लेषण करें',
  },
  disease_results_title: {
    en: 'Analysis Result',
    hi: 'विश्लेषण परिणाम',
  },
  disease_causes_title: {
    en: 'Potential Causes',
    hi: 'संभावित कारण',
  },
  disease_solutions_title: {
    en: 'Suggested Solutions',
    hi: 'सुझाए गए समाधान',
  },
  disease_detection_error: {
    en: 'Could not analyze the disease. Please try again.',
    hi: 'रोग का विश्लेषण नहीं किया जा सका। कृपया पुन: प्रयास करें।',
  },

  // Mandi Prices
  mandi_prices_title: {
    en: 'Mandi Price Trends',
    hi: 'मंडी मूल्य रुझान',
  },
  mandi_prices_subtitle: {
    en: 'Live market prices and demand for key crops.',
    hi: 'प्रमुख फसलों के लिए लाइव बाजार मूल्य और मांग।',
  },
  mandi_select_crop_placeholder: {
    en: 'Select a crop',
    hi: 'एक फसल चुनें',
  },
  crop_wheat: {
    en: 'Wheat',
    hi: 'गेहूँ',
  },
  crop_rice: {
    en: 'Rice',
    hi: 'चावल',
  },
  crop_cotton: {
    en: 'Cotton',
    hi: 'कपास',
  },
};

export type TranslationKey = keyof typeof translations;
