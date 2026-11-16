import { DEFAULT_COMPANY_EVALUATION_RUBRIC, DEFAULT_PLATFORM_SETTINGS } from "@/lib/platform-config";
export const techFlowCompany = {
    id: "company-1",
    name: "TechFlow Solutions",
    industry: "Software & Technology",
    location: "Amman, Jordan",
    website: "https://techflow.example.com",
    verified: true,
    verificationStatus: "Verified",
    size: "50-200",
    officialEmail: "hello@techflow.example.com",
    registrationNumber: "JO-452198",
    registrationCountry: "Jordan",
    foundedYear: "2016",
    about: "TechFlow Solutions builds enterprise software for customer support and operations teams across the MENA region.",
    contactPerson: {
        name: "Sarah Johnson",
        title: "Engineering Lead",
        email: "sarah.johnson@techflow.example.com",
        phone: "+962 7 9000 1200",
    },
    submittedAt: "2026-03-12",
};
const ahmadDocs = [
    { id: "doc-a1", name: "National ID", type: "Government ID", uploadedAt: "2026-03-02", status: "Accepted", fileName: "Ahmad_Ali_ID.pdf" },
    { id: "doc-a2", name: "Curriculum Vitae", type: "CV", uploadedAt: "2026-03-02", status: "Accepted", fileName: "Ahmad_Ali_CV.pdf" },
    { id: "doc-a3", name: "AWS Cloud Practitioner", type: "Certificate", uploadedAt: "2026-03-02", status: "Accepted", fileName: "AWS_Cloud_Practitioner.pdf" },
];
export const ahmadAli = {
    id: "dev-ahmad",
    firstName: "Ahmad",
    lastName: "Ali",
    name: "Ahmad Ali",
    email: "ahmad.ali@example.com",
    role: "Full-Stack Developer",
    careerPath: "Full-Stack Developer",
    preferredRole: "Full-Stack Developer",
    location: "Amman, Jordan",
    phone: "+962 7 9012 4450",
    overallLevel: 3,
    levelLabel: "Proficient",
    accountVerified: true,
    accountVerificationStatus: "Verified",
    accountVerifiedAt: "2026-03-08",
    weconnectVerified: true,
    weconnectVerifiedStatus: "Earned",
    weconnectVerifiedAt: "2026-07-20",
    skills: [
        { name: "React", level: "Master", verified: true, challengesCompleted: 12 },
        { name: "JavaScript", level: "Master", verified: true, challengesCompleted: 10 },
        { name: "Node.js", level: "Level 2", verified: true, challengesCompleted: 6 },
        { name: "PostgreSQL", level: "Level 2", verified: true, challengesCompleted: 4 },
        { name: "TypeScript", level: "Level 2", verified: true },
        { name: "REST APIs", level: "Level 2", verified: true },
    ],
    bio: "Full-stack developer focused on building reliable, user-centered web applications. Passionate about clean architecture and measurable delivery.",
    github: "https://github.com/ahmadali",
    linkedin: "https://linkedin.com/in/ahmadali",
    portfolio: "https://ahmadali.dev",
    cvUrl: "Ahmad_Ali_CV.pdf",
    education: [
        { id: "ed-a1", institution: "University of Jordan", degree: "B.Sc.", field: "Computer Science", startYear: "2018", endYear: "2022" },
    ],
    experience: [
        { id: "ex-a1", company: "Local SaaS Studio", title: "Full-Stack Developer", startDate: "2022-09", endDate: "Present", summary: "Built dashboard products with React, Node.js and PostgreSQL." },
    ],
    certificates: [
        { id: "cert-a1", name: "AWS Cloud Practitioner", issuer: "Amazon", issuedDate: "2025-11" },
    ],
    verificationDocuments: ahmadDocs,
    availability: "Available — 25 hrs/week",
    reliability: 96,
    averageScore: 91,
    requirementsAccuracy: 94,
    onTimeCompletion: 100,
    realProjectsCompleted: 4,
    internalProjectsCompleted: 5,
    challengesPassed: 12,
    companyEvaluations: 3,
    assessmentCompleted: true,
    matchScore: 94,
};
export const saraHassan = {
    id: "dev-sara",
    firstName: "Sara",
    lastName: "Hassan",
    name: "Sara Hassan",
    email: "sara.hassan@example.com",
    role: "Frontend Developer",
    careerPath: "Frontend Developer",
    preferredRole: "Frontend Developer",
    location: "Riyadh, Saudi Arabia",
    overallLevel: 3,
    levelLabel: "Proficient",
    accountVerified: true,
    accountVerificationStatus: "Verified",
    weconnectVerified: true,
    weconnectVerifiedStatus: "Earned",
    skills: [
        { name: "React", level: "Master", verified: true },
        { name: "TypeScript", level: "Level 2", verified: true },
        { name: "CSS", level: "Master", verified: true },
    ],
    github: "https://github.com/sarahassan",
    linkedin: "https://linkedin.com/in/sarahassan",
    portfolio: "https://sarahassan.dev",
    availability: "Available — 30 hrs/week",
    reliability: 94,
    averageScore: 89,
    requirementsAccuracy: 92,
    onTimeCompletion: 98,
    realProjectsCompleted: 3,
    internalProjectsCompleted: 4,
    challengesPassed: 10,
    companyEvaluations: 2,
    assessmentCompleted: true,
    matchScore: 91,
};
export const omarKhalid = {
    id: "dev-omar",
    firstName: "Omar",
    lastName: "Khalid",
    name: "Omar Khalid",
    email: "omar.khalid@example.com",
    role: "Full-Stack Developer",
    careerPath: "Full-Stack Developer",
    preferredRole: "Full-Stack Developer",
    location: "Dubai, UAE",
    overallLevel: 2,
    levelLabel: "Developing",
    accountVerified: true,
    accountVerificationStatus: "Verified",
    weconnectVerified: false,
    weconnectVerifiedStatus: "In Progress",
    skills: [
        { name: "React", level: "Level 2", verified: true },
        { name: "Node.js", level: "Level 2", verified: true },
        { name: "PostgreSQL", level: "Level 2", verified: true },
    ],
    github: "https://github.com/omarkhalid",
    availability: "Available — 20 hrs/week",
    reliability: 91,
    averageScore: 86,
    requirementsAccuracy: 88,
    onTimeCompletion: 95,
    realProjectsCompleted: 2,
    internalProjectsCompleted: 3,
    challengesPassed: 8,
    companyEvaluations: 1,
    assessmentCompleted: true,
    matchScore: 88,
};
export const linaFaraj = {
    id: "dev-lina",
    firstName: "Lina",
    lastName: "Faraj",
    name: "Lina Faraj",
    email: "lina.faraj@example.com",
    role: "Backend Developer",
    careerPath: "Backend Developer",
    preferredRole: "Backend Developer",
    location: "Cairo, Egypt",
    overallLevel: 3,
    levelLabel: "Proficient",
    accountVerified: true,
    accountVerificationStatus: "Verified",
    weconnectVerified: true,
    weconnectVerifiedStatus: "Earned",
    skills: [
        { name: "Node.js", level: "Master", verified: true },
        { name: "PostgreSQL", level: "Level 2", verified: true },
        { name: "REST APIs", level: "Master", verified: true },
    ],
    github: "https://github.com/linafaraj",
    availability: "Available — 28 hrs/week",
    reliability: 93,
    averageScore: 88,
    requirementsAccuracy: 90,
    onTimeCompletion: 97,
    realProjectsCompleted: 3,
    internalProjectsCompleted: 4,
    challengesPassed: 9,
    companyEvaluations: 2,
    assessmentCompleted: true,
    matchScore: 85,
};
export const youssefHaddad = {
    id: "dev-new-1",
    firstName: "Youssef",
    lastName: "Haddad",
    name: "Youssef Haddad",
    email: "youssef.haddad@example.com",
    role: "Frontend Developer",
    careerPath: null,
    preferredRole: "Frontend Developer",
    location: "Beirut, Lebanon",
    phone: "+961 3 445 120",
    overallLevel: 1,
    levelLabel: "Foundation",
    accountVerified: false,
    accountVerificationStatus: "Pending Verification",
    weconnectVerified: false,
    weconnectVerifiedStatus: "Not Started",
    skills: [
        { name: "React", level: "Locked", verified: false },
        { name: "CSS", level: "Locked", verified: false },
    ],
    bio: "Frontend-focused developer applying for account verification before choosing a career path and taking the initial assessment.",
    github: "https://github.com/yhaddad",
    linkedin: "https://linkedin.com/in/youssefhaddad",
    portfolio: "https://youssefhaddad.dev",
    cvUrl: "Youssef_Haddad_CV.pdf",
    education: [
        { id: "ed-y1", institution: "American University of Beirut", degree: "B.Sc.", field: "Computer Science", startYear: "2019", endYear: "2023" },
    ],
    experience: [
        { id: "ex-y1", company: "Studio North", title: "Junior Frontend Developer", startDate: "2023-07", endDate: "Present", summary: "Implemented marketing sites and internal dashboards in React." },
    ],
    certificates: [
        { id: "cert-y1", name: "Meta Front-End Developer", issuer: "Coursera", issuedDate: "2025-06" },
    ],
    verificationDocuments: [
        { id: "doc-y1", name: "Lebanese ID", type: "Government ID", uploadedAt: "2026-08-18", status: "Pending Review", fileName: "Youssef_Haddad_ID.pdf" },
        { id: "doc-y2", name: "Curriculum Vitae", type: "CV", uploadedAt: "2026-08-18", status: "Pending Review", fileName: "Youssef_Haddad_CV.pdf" },
        { id: "doc-y3", name: "Meta Certificate", type: "Certificate", uploadedAt: "2026-08-18", status: "Pending Review", fileName: "Meta_Frontend.pdf" },
    ],
    availability: "Available — 20 hrs/week",
    reliability: 0,
    averageScore: 0,
    requirementsAccuracy: 0,
    onTimeCompletion: 0,
    realProjectsCompleted: 0,
    internalProjectsCompleted: 0,
    challengesPassed: 0,
    companyEvaluations: 0,
    assessmentCompleted: false,
};
export const nadiaSaleh = {
    id: "dev-new-2",
    firstName: "Nadia",
    lastName: "Saleh",
    name: "Nadia Saleh",
    email: "nadia.saleh@example.com",
    role: "Backend Developer",
    careerPath: null,
    preferredRole: "Backend Developer",
    location: "Amman, Jordan",
    overallLevel: 1,
    levelLabel: "Foundation",
    accountVerified: false,
    accountVerificationStatus: "More Information Required",
    adminNotes: "Please upload a clearer government ID and an updated CV covering 2025–2026.",
    weconnectVerified: false,
    weconnectVerifiedStatus: "Not Started",
    skills: [{ name: "Node.js", level: "Locked", verified: false }],
    github: "https://github.com/nadiasaleh",
    linkedin: "https://linkedin.com/in/nadiasaleh",
    cvUrl: "Nadia_Saleh_CV.pdf",
    education: [
        { id: "ed-n1", institution: "Princess Sumaya University", degree: "B.Sc.", field: "Software Engineering", startYear: "2017", endYear: "2021" },
    ],
    experience: [
        { id: "ex-n1", company: "PayGrid", title: "Backend Engineer", startDate: "2021-10", endDate: "Present", summary: "API and data pipeline work in Node.js and PostgreSQL." },
    ],
    verificationDocuments: [
        { id: "doc-n1", name: "National ID (blurred)", type: "Government ID", uploadedAt: "2026-08-15", status: "Rejected", fileName: "Nadia_ID.jpg" },
        { id: "doc-n2", name: "Curriculum Vitae", type: "CV", uploadedAt: "2026-08-15", status: "Pending Review", fileName: "Nadia_Saleh_CV.pdf" },
    ],
    availability: "Available",
    reliability: 0,
    averageScore: 0,
    requirementsAccuracy: 0,
    onTimeCompletion: 0,
    realProjectsCompleted: 0,
    internalProjectsCompleted: 0,
    challengesPassed: 0,
    companyEvaluations: 0,
    assessmentCompleted: false,
};
export const karimNasser = {
    id: "dev-new-3",
    firstName: "Karim",
    lastName: "Nasser",
    name: "Karim Nasser",
    email: "karim.nasser@example.com",
    role: "Full-Stack Developer",
    careerPath: null,
    preferredRole: "Full-Stack Developer",
    location: "Cairo, Egypt",
    overallLevel: 1,
    levelLabel: "Foundation",
    accountVerified: false,
    accountVerificationStatus: "Pending Verification",
    weconnectVerified: false,
    weconnectVerifiedStatus: "Not Started",
    skills: [],
    github: "https://github.com/karimnasser",
    linkedin: "https://linkedin.com/in/karimnasser",
    portfolio: "https://karimnasser.dev",
    cvUrl: "Karim_Nasser_CV.pdf",
    education: [
        { id: "ed-k1", institution: "Cairo University", degree: "B.Sc.", field: "Information Systems", startYear: "2018", endYear: "2022" },
    ],
    experience: [
        { id: "ex-k1", company: "Nile Apps", title: "Full-Stack Intern", startDate: "2022-06", endDate: "2023-01", summary: "Supported React and Express feature work on internal tools." },
    ],
    certificates: [
        { id: "cert-k1", name: "JavaScript Algorithms", issuer: "freeCodeCamp", issuedDate: "2024-02" },
    ],
    verificationDocuments: [
        { id: "doc-k1", name: "National ID", type: "Government ID", uploadedAt: "2026-08-19", status: "Pending Review", fileName: "Karim_Nasser_ID.pdf" },
        { id: "doc-k2", name: "Curriculum Vitae", type: "CV", uploadedAt: "2026-08-19", status: "Pending Review", fileName: "Karim_Nasser_CV.pdf" },
        { id: "doc-k3", name: "freeCodeCamp Certificate", type: "Certificate", uploadedAt: "2026-08-19", status: "Pending Review", fileName: "FCC_JS.pdf" },
        { id: "doc-k4", name: "Portfolio screenshots", type: "Portfolio Evidence", uploadedAt: "2026-08-19", status: "Pending Review", fileName: "Portfolio_Evidence.zip" },
    ],
    availability: "Available — 25 hrs/week",
    reliability: 0,
    averageScore: 0,
    requirementsAccuracy: 0,
    onTimeCompletion: 0,
    realProjectsCompleted: 0,
    internalProjectsCompleted: 0,
    challengesPassed: 0,
    companyEvaluations: 0,
    assessmentCompleted: false,
};
export const topMatches = [];
function makeAssignment(projectId, developer, rest) {
    return {
        id: `${projectId}-${developer.id}`,
        projectId,
        developerId: developer.id,
        developer,
        matchScore: developer.matchScore ?? 0,
        invitedAt: "2026-08-12",
        progress: 0,
        submissionStatus: "Not Submitted",
        evaluationStatus: "Not Started",
        completionStatus: "Pending",
        ...rest,
    };
}
const csmAssignments = [
    makeAssignment("proj-csm-dashboard", ahmadAli, {
        invitationStatus: "Accepted",
        respondedAt: "2026-08-13",
        workStatus: "In Progress",
        progress: 78,
        lastUpdate: "2 hours ago",
        submissionStatus: "Not Submitted",
    }),
    makeAssignment("proj-csm-dashboard", saraHassan, {
        invitationStatus: "Accepted",
        respondedAt: "2026-08-13",
        workStatus: "Submitted",
        progress: 100,
        lastUpdate: "5 hours ago",
        submissionStatus: "Submitted",
        submittedAt: "2026-08-19",
        evaluationStatus: "Under Review",
    }),
    makeAssignment("proj-csm-dashboard", omarKhalid, {
        invitationStatus: "Declined",
        respondedAt: "2026-08-13",
        progress: 0,
        lastUpdate: "Aug 13",
    }),
    makeAssignment("proj-csm-dashboard", linaFaraj, {
        invitationStatus: "Accepted",
        respondedAt: "2026-08-14",
        workStatus: "In Progress",
        progress: 71,
        lastUpdate: "3 hours ago",
        submissionStatus: "Not Submitted",
    }),
];
const fleetAssignments = [
    makeAssignment("proj-inv-1", ahmadAli, {
        invitationStatus: "Invited",
        matchScore: 94,
        progress: 0,
    }),
    makeAssignment("proj-inv-1", saraHassan, {
        invitationStatus: "Accepted",
        matchScore: 91,
        respondedAt: "2026-08-22",
        workStatus: "Submitted",
        progress: 100,
        lastUpdate: "45 minutes ago",
        submissionStatus: "Submitted",
        submittedAt: "2026-09-05",
        evaluationStatus: "Under Review",
    }),
    makeAssignment("proj-inv-1", omarKhalid, {
        invitationStatus: "Accepted",
        matchScore: 88,
        respondedAt: "2026-08-22",
        workStatus: "In Progress",
        progress: 68,
        lastUpdate: "2 hours ago",
        submissionStatus: "Not Submitted",
    }),
    makeAssignment("proj-inv-1", linaFaraj, {
        invitationStatus: "Accepted",
        matchScore: 85,
        respondedAt: "2026-08-23",
        workStatus: "Under Review",
        progress: 100,
        lastUpdate: "Yesterday",
        submissionStatus: "Under Review",
        submittedAt: "2026-09-04",
        evaluationStatus: "Pending",
    }),
];
export const customerSupportProject = {
    id: "proj-csm-dashboard",
    title: "Customer Support Management Dashboard",
    type: "Paid Project",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    technologies: ["React", "Node.js", "PostgreSQL", "REST APIs", "Authentication", "Responsive Dashboard"],
    skills: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    duration: "3 Weeks",
    deadline: "2026-09-15",
    state: "In Progress",
    matchScore: 94,
    description: "Build a customer support management dashboard that enables support teams to track tickets, assign agents, monitor SLA performance, and generate operational reports.",
    requirements: [
        "Authentication & role-based access",
        "Support ticket dashboard",
        "REST API with PostgreSQL",
        "Database integration",
        "Responsive design",
        "Agent assignment workflow",
        "Reporting module",
    ],
    functionalRequirements: [
        "Support agents can create, assign and resolve tickets",
        "Managers can monitor SLA performance",
        "Role-based views for agent, lead and admin",
        "Operational reporting for volume and response time",
    ],
    technicalRequirements: [
        "React dashboard with authenticated sessions",
        "Node.js REST API backed by PostgreSQL",
        "Responsive layout for desktop and tablet",
    ],
    deliverables: ["Deployed preview", "Technical summary", "Demo recording", "Source repository after purchase"],
    difficulty: "Intermediate",
    workload: "20–25 hours per week",
    budget: 5800,
    paymentStatus: "Pending",
    createdAt: "2026-08-10",
    lastActivity: "2 hours ago",
    assignments: csmAssignments,
    evaluator: {
        name: "Sarah Johnson",
        title: "Engineering Lead",
        email: "sarah.johnson@techflow.example.com",
    },
    reviewStages: [
        { id: "rs-1", label: "Kickoff", status: "Completed", date: "2026-08-14" },
        { id: "rs-2", label: "Week 1 Review", status: "Completed", date: "2026-08-21" },
        { id: "rs-3", label: "Week 2 Review", status: "Upcoming", date: "2026-08-28" },
        { id: "rs-4", label: "Final Evaluation", status: "Pending" },
    ],
};
export const fleetMaintenanceProject = {
    id: "proj-inv-1",
    title: "Fleet Maintenance Dashboard",
    type: "Paid Project",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    technologies: ["React", "Node.js", "PostgreSQL"],
    skills: ["React", "Node.js", "PostgreSQL"],
    duration: "3 Weeks",
    deadline: "2026-09-22",
    state: "Under Review",
    matchScore: 94,
    description: "A maintenance operations dashboard for vehicle fleets, covering work orders, technician assignment and service history.",
    requirements: ["Work order board", "Technician assignment", "Service history", "Authentication"],
    functionalRequirements: ["Dispatchers can create and assign work orders", "Technicians update job status in the field"],
    technicalRequirements: ["React client", "Node.js API", "PostgreSQL persistence"],
    deliverables: ["Preview deployment", "Technical summary"],
    difficulty: "Intermediate",
    workload: "20–25 hours per week",
    budget: 5800,
    paymentStatus: "Pending",
    createdAt: "2026-08-20",
    lastActivity: "4 hours ago",
    assignments: fleetAssignments,
    evaluator: {
        name: "Khalid Nasser",
        title: "Operations Evaluator",
        email: "khalid@techflow.example.com",
    },
    reviewStages: [
        { id: "rs-f1", label: "Kickoff", status: "Completed", date: "2026-08-24" },
        { id: "rs-f2", label: "Week 1 Review", status: "Completed", date: "2026-08-31" },
        { id: "rs-f3", label: "Week 2 Review", status: "Upcoming", date: "2026-09-08" },
        { id: "rs-f4", label: "Final Evaluation", status: "Pending" },
    ],
};
export const inventoryProject = {
    id: "proj-active-1",
    title: "Inventory Tracking Portal",
    type: "Training Project",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    technologies: ["React", "Node.js", "MongoDB"],
    duration: "2 Weeks",
    deadline: "2026-08-28",
    state: "In Progress",
    description: "Internal inventory tracking portal for warehouse operations.",
    requirements: ["CRUD operations", "Search & filters", "Export reports"],
    workload: "15 hrs/week",
    createdAt: "2026-08-08",
    lastActivity: "Yesterday",
    assignments: [
        makeAssignment("proj-active-1", ahmadAli, {
            invitationStatus: "Accepted",
            workStatus: "In Progress",
            progress: 55,
            lastUpdate: "Yesterday",
        }),
    ],
    evaluator: { name: "Sarah Johnson", title: "Engineering Lead", email: "sarah.johnson@techflow.example.com" },
    reviewStages: [
        { id: "inv-k", label: "Kickoff", status: "Completed", date: "2026-08-09" },
        { id: "inv-w1", label: "Week 1 Review", status: "Upcoming" },
        { id: "inv-fe", label: "Final Evaluation", status: "Pending" },
    ],
};
export const onboardingProject = {
    id: "proj-submitted-1",
    title: "Employee Onboarding App",
    type: "Hiring Challenge",
    company: techFlowCompany,
    role: "Frontend Developer",
    technologies: ["React", "TypeScript", "CSS"],
    duration: "2 Weeks",
    deadline: "2026-08-01",
    state: "Under Review",
    description: "Multi-step onboarding experience for new hires.",
    requirements: ["Multi-step form", "Document upload", "Progress tracking"],
    workload: "18 hrs/week",
    createdAt: "2026-07-18",
    lastActivity: "3 days ago",
    assignments: [
        makeAssignment("proj-submitted-1", ahmadAli, {
            invitationStatus: "Accepted",
            workStatus: "Submitted",
            progress: 100,
            submittedAt: "2026-08-01",
            submissionStatus: "Submitted",
            evaluationStatus: "Under Review",
        }),
    ],
};
export const completedPaidProject = {
    id: "proj-completed-1",
    title: "Customer Management Dashboard",
    type: "Paid Project",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    technologies: ["React", "Node.js", "PostgreSQL"],
    duration: "3 weeks",
    deadline: "2026-06-15",
    state: "Purchased",
    description: "Customer relationship management dashboard with analytics.",
    requirements: ["Authentication", "Dashboard", "REST API", "Database Integration", "Responsive Design"],
    workload: "22 hrs/week",
    budget: 4200,
    paymentStatus: "Paid",
    createdAt: "2026-05-20",
    lastActivity: "Aug 1",
    purchasedAssignmentId: "proj-completed-1-dev-ahmad",
    assignments: [
        makeAssignment("proj-completed-1", ahmadAli, {
            invitationStatus: "Accepted",
            workStatus: "Completed",
            progress: 100,
            submittedAt: "2026-06-12",
            submissionStatus: "Evaluated",
            evaluationStatus: "Completed",
            completionStatus: "Completed",
            purchased: true,
        }),
    ],
};
export const hrAnalyticsProject = {
    id: "proj-2",
    title: "HR Analytics Dashboard",
    type: "Training Project",
    company: techFlowCompany,
    role: "Frontend Developer",
    technologies: ["React", "TypeScript", "Recharts"],
    duration: "2 Weeks",
    deadline: "2026-09-01",
    state: "Matching",
    description: "Analytics dashboard for HR metrics.",
    requirements: ["Charts", "Filters", "Export"],
    workload: "15 hrs/week",
    createdAt: "2026-08-16",
    lastActivity: "1 day ago",
    assignments: [
        makeAssignment("proj-2", saraHassan, { invitationStatus: "Matched", matchScore: 96, invitedAt: undefined }),
        makeAssignment("proj-2", ahmadAli, { invitationStatus: "Matched", matchScore: 91, invitedAt: undefined }),
        makeAssignment("proj-2", linaFaraj, { invitationStatus: "Matched", matchScore: 88, invitedAt: undefined }),
        makeAssignment("proj-2", omarKhalid, { invitationStatus: "Matched", matchScore: 85, invitedAt: undefined }),
    ],
};
export const notCompletedProject = {
    id: "proj-not-completed-1",
    title: "Legacy API Migration",
    type: "Training Project",
    company: techFlowCompany,
    role: "Backend Developer",
    technologies: ["Node.js", "PostgreSQL"],
    duration: "2 Weeks",
    deadline: "2026-07-15",
    state: "Completed",
    description: "Migrate legacy REST endpoints to a new service architecture.",
    requirements: ["Endpoint mapping", "Data validation", "Integration tests"],
    workload: "15 hrs/week",
    createdAt: "2026-07-01",
    lastActivity: "Jul 16",
    assignments: [
        makeAssignment("proj-not-completed-1", ahmadAli, {
            invitationStatus: "Accepted",
            workStatus: "Not Completed",
            progress: 40,
            completionStatus: "Not Completed",
            evaluationStatus: "Completed",
        }),
    ],
};
export const developerProjects = [];
export const companyProjects = [];
export const allDeveloperProjects = [];
export const adminProjectsList = [];
export const developerNotifications = [];
export const hiringPipeline = [];
export const internalProjects = [];
export const skillChallenges = [];
export const adminMetrics = {
    totalDevelopers: 0,
    accountVerifiedDevelopers: 0,
    weconnectVerifiedDevelopers: 0,
    totalCompanies: 0,
    pendingCompanyVerification: 0,
    pendingDeveloperVerification: 0,
    activeProjects: 0,
    projectsAwaitingEvaluation: 0,
    completedProjects: 0,
    successfulHires: 0,
    /** Total value of purchased Paid Projects — not WeConnect income. */
    grossProjectVolume: 0,
    /** Actual commission earned by WeConnect on purchased paid projects. */
    projectCommissionRevenue: 0,
    hiringFeeRevenue: 0,
    subscriptionRevenue: 0,
    completionRate: 0,
    hiringConversion: 0,
};
export const matchReasons = {};

export const assessmentQuestions = [];
export const assessmentFollowUps = [];
export const companyTeamMembers = [];
export const companyNotifications = [];
export const companyPayments = [];
export const companyInterviews = [];
export const companyOffers = [];
export const companyEvaluations = [];
export const projectSubmissions = [];
export const developerProgress = csmAssignments
    .filter((a) => a.invitationStatus === "Accepted")
    .map((a) => ({
    developer: a.developer,
    assignment: a,
    progress: a.progress,
    milestone: a.developerId === "dev-ahmad"
        ? "Reporting module in progress"
        : a.developerId === "dev-sara"
            ? "Dashboard submitted — awaiting evaluation"
            : "Database schema finalized",
    lastUpdate: a.lastUpdate ?? "—",
}));
export const projectAnalysis = {
    complexity: "Moderate",
    estimatedHours: "60–75",
    skillMatch: 91,
    riskLevel: "Low",
    recommendations: [
        "Split authentication and dashboard into parallel workstreams",
        "Prioritize SLA reporting — highest business impact requirement",
        "Schedule mid-project checkpoint at week 2",
    ],
    requirementBreakdown: [
        { requirement: "Authentication & role-based access", difficulty: "Medium", hours: 12 },
        { requirement: "Support ticket dashboard", difficulty: "Medium", hours: 16 },
        { requirement: "REST API with PostgreSQL", difficulty: "High", hours: 20 },
        { requirement: "Agent assignment workflow", difficulty: "Medium", hours: 10 },
        { requirement: "Reporting module", difficulty: "High", hours: 14 },
    ],
};
/** @deprecated old weighted UI/UX rubric — use DEFAULT_COMPANY_EVALUATION_RUBRIC */
export const evaluationRubric = DEFAULT_COMPANY_EVALUATION_RUBRIC.map((c) => ({
    criterion: c.label,
    weight: c.weight,
    description: c.description,
}));
export const developerEvaluations = [];
export const projectActivityTimeline = [];
export const adminDeveloperQueue = [];
export const adminCompanyQueue = [];
export const adminDevelopersList = [];
export const adminCompaniesList = [];
export const adminAssessments = [];
export const adminQuestions = [];
export const adminChallenges = [];
export const adminChallengePaths = [];
export const adminSkills = [];
export const adminReliabilityHistory = [];
export const adminDisputes = [];
export const adminSubscriptions = [];
export const adminPaymentsList = [];
export const reportChartData = { developerGrowth: [], projectVolume: [], revenue: [] };

export const companyDashboardChart = { hiringFunnel: [], spendByMonth: [] };

export const allDevelopers = [];
export const selfDeclaredSkills = [];
export const assessmentResults = {
    overallLevel: 2,
    levelLabel: "Developing",
    score: 78,
    passedAt: "2026-08-10",
    skillBreakdown: [
        { skill: "React", score: 85, level: "Level 2" },
        { skill: "JavaScript", score: 82, level: "Level 2" },
        { skill: "Node.js", score: 71, level: "Level 2" },
        { skill: "REST APIs", score: 74, level: "Level 2" },
        { skill: "PostgreSQL", score: 68, level: "Level 1" },
        { skill: "Architecture", score: 72, level: "Level 2" },
    ],
};
export const developerInterview = {
    id: "int-1",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    type: "Technical Interview",
    date: "2026-08-25",
    time: "14:00",
    timezone: "Asia/Amman",
    duration: "45 minutes",
    format: "Video call",
    interviewer: "Sarah Johnson, Engineering Lead",
    status: "Scheduled",
    notes: "Prepare to discuss your Customer Management Dashboard project and approach to REST API design.",
    meetingLink: "https://meet.example.com/techflow-ahmad",
};
export const developerOffer = {
    id: "offer-1",
    company: techFlowCompany,
    role: "Full-Stack Developer",
    type: "Full-time",
    salary: "JOD 1,800 / month",
    startDate: "2026-10-01",
    location: "Amman, Jordan (Hybrid)",
    benefits: ["Health insurance", "Learning budget", "Flexible hours"],
    expiresAt: "2026-09-05",
    status: "Pending",
    message: "We were impressed by your verified project performance and assessment scores. We'd like to extend an offer to join our product engineering team.",
};
export const projectMilestones = [];
export const developerProjectSubmissions = [];
export const projectFeedback = [];
export const projectActivity = [];
export function getVerifiedCriteria(developer) {
    const s = DEFAULT_PLATFORM_SETTINGS;
    return [
        { label: "Account verified", met: developer.accountVerified },
        { label: "Initial assessment completed", met: Boolean(developer.assessmentCompleted) },
        {
            label: `${s.weconnectVerifiedMinInternalProjects} successful internal projects`,
            met: developer.internalProjectsCompleted >= s.weconnectVerifiedMinInternalProjects,
            current: developer.internalProjectsCompleted,
            required: s.weconnectVerifiedMinInternalProjects,
        },
        {
            label: `${s.weconnectVerifiedMinReliability}%+ reliability`,
            met: developer.reliability >= s.weconnectVerifiedMinReliability,
        },
        {
            label: `Average project performance ${s.weconnectVerifiedMinAverageScore}%+`,
            met: developer.averageScore >= s.weconnectVerifiedMinAverageScore,
        },
        { label: "Verified skills on the chosen career path", met: developer.skills.some((sk) => sk.verified) },
        {
            label: `${s.weconnectVerifiedMinCompanyEvaluations}+ company evaluations`,
            met: developer.companyEvaluations >= s.weconnectVerifiedMinCompanyEvaluations,
        },
        { label: "Platform integrity in good standing", met: developer.accountVerificationStatus !== "Suspended" },
    ];
}
export const verifiedCriteria = getVerifiedCriteria(ahmadAli);
export const reactChallengePath = [];
export const companyDisputes = [];
