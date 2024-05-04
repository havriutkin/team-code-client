 import Skill from "./SkillModel";
 
 interface User {
    id: number;
    name: string;
    email: string;
    experience: string;
    bio: string;
    githubLink: string;
    skills: Skill[];
}

export default User;

