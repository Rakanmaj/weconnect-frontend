export const DEFAULT_COMPANY_EVALUATION_RUBRIC = [
    {
        key: "codeQuality",
        label: "Code Quality",
        description: "Structure, readability, testing and maintainability of the submitted work.",
        weight: 20,
        enabled: true,
    },
    {
        key: "requirementsUnderstanding",
        label: "Requirements Understanding",
        description: "How accurately the submission reflects the stated functional and technical requirements.",
        weight: 20,
        enabled: true,
    },
    {
        key: "communication",
        label: "Communication",
        description: "Clarity of updates, responsiveness and quality of technical explanations.",
        weight: 15,
        enabled: true,
    },
    {
        key: "deadlineAdherence",
        label: "Deadline Adherence",
        description: "Whether milestones and the final submission were delivered on the agreed timeline.",
        weight: 15,
        enabled: true,
    },
    {
        key: "problemSolving",
        label: "Problem Solving",
        description: "Ability to work through blockers and make sound implementation decisions.",
        weight: 15,
        enabled: true,
    },
    {
        key: "independence",
        label: "Independence",
        description: "How little supervision the developer needed to produce a complete submission.",
        weight: 15,
        enabled: true,
    },
];
export const DEFAULT_PLATFORM_SETTINGS = {
    projectCommissionPercentage: 25,
    weconnectVerifiedMinReliability: 90,
    weconnectVerifiedMinInternalProjects: 5,
    weconnectVerifiedMinCompanyEvaluations: 2,
    weconnectVerifiedMinAverageScore: 80,
    masterLevelMinChallenges: 10,
    platformName: "WeConnect",
    supportEmail: "support@weconnect.io",
    companyEvaluationRubric: DEFAULT_COMPANY_EVALUATION_RUBRIC,
};
export const CAREER_PATHS = [
    "Frontend Developer",
    "Backend Developer",
    "Full-Stack Developer",
];
/**
 * Project types that carry a monetary model. Training projects and hiring
 * challenges never show a paid-project payout breakdown.
 */
export function isPaidProjectType(type) {
    return type === "Paid Project";
}
/**
 * Splits a project budget into WeConnect commission and developer payout.
 *
 * The budget is the gross total: commission is deducted from it rather than
 * charged in addition to it.
 */
export function calculateProjectFinancials(budget, commissionPercentage = DEFAULT_PLATFORM_SETTINGS.projectCommissionPercentage) {
    const commissionAmount = Math.round((budget * commissionPercentage) / 100);
    return {
        budget,
        commissionPercentage,
        commissionAmount,
        developerPayout: budget - commissionAmount,
    };
}
export function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}
