import type { Intro, Place, Skill } from './types.ts';
export type { Contact, Experience, Intro, NavLink, Place, Post, Project, Skill } from './types.ts';
export declare const intro: Intro;
export declare function absoluteHref(href: string, site?: string): string;
export declare const places: Place[];
export declare const skills: Skill[];
export declare const name: string, names: string[], degree: string, city: string, bio: string, kaomoji: string, avatar: string, site: string, contact: import("./types.ts").Contact, pages: {
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
}, sections: {
    experience: string;
    skills: string;
    openSource: string;
}, nav: import("./types.ts").NavLink[], experiences: import("./types.ts").Experience[], projects: import("./types.ts").Project[], posts: import("./types.ts").Post[];
export declare function formatCount(count: number): string;
export declare function fullName(role?: string): string;
/** Terminal-oriented view of the same intro. */
export declare const profile: {
    name: string;
    givenNames: readonly [string, ...string[]];
    role: string;
    bio: string;
    phone: string;
    email: string;
    site: string;
    places: Place[];
    experiences: import("./types.ts").Experience[];
    skills: Skill[];
    projects: {
        name: string;
        href: string;
        summary: string;
        language: string;
        stars: number;
        forks: number;
    }[];
};
