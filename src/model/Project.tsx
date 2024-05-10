import Skill from "./SkillModel";
import User from "./UserModel";

interface Project {
    id: number;
    name: string;
    description: boolean;
    status: boolean;
    participantsNumber: number;
    maxParticipantsNumber: number;
    startDate: Date;
    gitRepository: string;
    projectLevel: string;
    owner: User;
    skills: Skill[];
}

export default Project;
