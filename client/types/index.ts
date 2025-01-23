export interface ZodError {
    success: boolean;
    error:   Error;
}

export interface Error {
    issues: Issue[];
    name:   string;
}

export interface Issue {
    code:     string;
    expected: string;
    received: string;
    path:     string[];
    message:  string;
}
