const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

const teamMembers = `
export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  imageUrl: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'shailendra-singh-tomar',
    name: 'Shailendra Singh Tomar',
    designation: 'Founder & Editor in Chief',
    phone: '9695432994',
    email: 'shailendrasingh35307@gmail.com',
    imageUrl: 'https://res.cloudinary.com/mzqxmg0a/image/upload/v1787680775/WhatsApp_Image_2026-08-24_at_23.04.09.jpg'
  },
  {
    id: 'desk',
    name: 'Desk',
    designation: 'Editorial Team',
    phone: '',
    email: 'contact@tevarnews.in',
    imageUrl: ''
  }
];
`;

content = content + "\n" + teamMembers;
fs.writeFileSync('src/data.ts', content);
console.log("Patched data.ts");
