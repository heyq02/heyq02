export interface Project {
    name: string;
    href: string;
    summary: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
}
export interface Place {
    label: string;
    href: string;
    detail: string;
}
export interface Experience {
    company: string;
    href: string;
    start: string;
    end: string;
    points: string[];
}
export interface Skill {
    name: string;
    href: string;
    summary: string;
}
export interface Post {
    slug: string;
    title: string;
    date: string;
    summary: string;
}
export interface NavLink {
    id: 'home' | 'blog';
    href: string;
    label: string;
}
export interface Contact {
    phone: string;
    email: string;
}
export interface Intro {
    name: string;
    names: string[];
    degree: string;
    city: string;
    bio: string;
    kaomoji: string;
    avatar: string;
    site: string;
    contact: Contact;
    pages: {
        home: {
            kicker: string;
            title: string;
            description: string;
        };
        blog: {
            title: string;
            description: string;
            heading: string;
            empty: string;
        };
    };
    sections: {
        experience: string;
        skills: string;
        openSource: string;
    };
    nav: NavLink[];
    places: Place[];
    experiences: Experience[];
    skills: Skill[];
    projects: Project[];
    posts: Post[];
}
