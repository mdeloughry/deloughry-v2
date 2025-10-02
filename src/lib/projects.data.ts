export type Project = {
	slug: string;
	title: string;
	description: string;
	url?: string;
	tags: string[];
	category: 'tool' | 'experiment' | 'work-in-progress' | 'visualization' | 'monitoring';
	status: 'live' | 'development' | 'completed';
	technologies?: string[];
	image?: string;
};

export const projects: Project[] = [
	{
		slug: 'nhs-number-generator',
		title: 'NHS Number Generator and Validator',
		description: 'A utility tool for generating and validating NHS numbers with proper checksum validation.',
		url: 'https://nhs-number-gen.m4p.uk/',
		tags: ['utility', 'healthcare', 'validation', 'generator'],
		category: 'tool',
		status: 'live',
		technologies: ['JavaScript', 'HTML', 'CSS']
	},
	{
		slug: 'twitch-globe',
		title: 'Twitch Globe',
		description: 'Interactive 3D globe visualization showing Twitch streamers around the world.',
		url: 'https://globe.m4p.uk/',
		tags: ['visualization', 'twitch', '3d', 'interactive', 'streaming'],
		category: 'visualization',
		status: 'live',
		technologies: ['Three.js', 'JavaScript', 'WebGL']
	},
	{
		slug: 'game-of-life',
		title: 'Game of Life',
		description: 'Conway\'s Game of Life implementation with interactive cellular automaton simulation.',
		url: '/projects/gol',
		tags: ['simulation', 'algorithm', 'cellular-automaton', 'interactive'],
		category: 'experiment',
		status: 'development',
		technologies: ['JavaScript', 'Canvas API', 'React']
	}
];

export function getAllProjects(): Project[] {
	return projects.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProject(slug: string): Project | null {
	return projects.find(p => p.slug === slug) ?? null;
}

export function getProjectsByCategory(category: Project['category']): Project[] {
	return projects.filter(p => p.category === category);
}

export function getProjectsByStatus(status: Project['status']): Project[] {
	return projects.filter(p => p.status === status);
}
