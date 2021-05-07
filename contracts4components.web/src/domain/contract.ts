export interface Version {
    id: number;
    testResults: any[];
    fileLines: string[];
}

export interface Versions {
    [key: string]: Version;
}

export interface Contract {
    id: number;
    provider: string;
    consumer: string;
    element: string;
    versions: Versions;
}