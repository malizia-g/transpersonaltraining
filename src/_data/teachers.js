const fs = require('fs');
const path = require('path');

module.exports = function() {
  const biosDir = path.join(__dirname, 'bios');
  const coreTeachersPath = path.join(__dirname, 'coreTeachers.json');
  const guestTeachersPath = path.join(__dirname, 'guestTeachers.json');
  
  // Read JSON files
  const coreTeachers = JSON.parse(fs.readFileSync(coreTeachersPath, 'utf-8'));
  const guestTeachers = JSON.parse(fs.readFileSync(guestTeachersPath, 'utf-8'));
  
  // Function to parse markdown bio files
  function parseBioFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = {};
    
    // Split by ## headers
    const parts = content.split(/^##\s+/m);
    
    // First part before any header (if exists)
    if (parts[0].trim()) {
      sections.intro = parts[0].trim();
    }
    
    // Parse each section
    for (let i = 1; i < parts.length; i++) {
      const lines = parts[i].split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      
      // Normalize section names
      const normalizedTitle = title.toLowerCase()
        .replace(/[\s&\/]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      
      sections[normalizedTitle] = body;
    }
    
    return sections;
  }
  
  // Read all bio files
  const bioFiles = fs.readdirSync(biosDir).filter(file => file.endsWith('.md'));
  const bios = {};
  
  bioFiles.forEach(file => {
    const id = file.replace('.md', '');
    const filePath = path.join(biosDir, file);
    bios[id] = parseBioFile(filePath);
  });
  
  // Merge bio data with teacher data
  function enrichTeacher(teacher) {
    const bio = bios[teacher.id];
    if (bio) {
      return {
        ...teacher,
        bio: bio.biography || bio.intro || '',
        credentials_detail: bio.credentials || bio.academic_degrees_certificates || '',
        experience: bio.experience || '',
        publications: bio.selected_publications || bio.publications || ''
      };
    }
    return teacher;
  }
  
  // Enrich all teachers
  const enrichedCore = coreTeachers.map(enrichTeacher);
  const enrichedGuest = guestTeachers.map(enrichTeacher);
  
  return {
    core: enrichedCore,
    guest: enrichedGuest,
    all: [...enrichedCore, ...enrichedGuest]
  };
};
