export const CURRENT_DEVELOPER_ID = "dev-ahmad";
export function getAssignments(project) {
    return project.assignments ?? [];
}
/** Top 4 matches, including developers who declined. */
export function getMatchedAssignments(project) {
    return getAssignments(project).slice().sort((a, b) => b.matchScore - a.matchScore);
}
/** Developers who accepted and are actually working on the project. */
export function getAcceptedAssignments(project) {
    return getAssignments(project).filter((a) => a.invitationStatus === "Accepted");
}
export function getActiveWorkAssignments(project) {
    return getAcceptedAssignments(project).filter((a) => a.workStatus && a.workStatus !== "Not Completed");
}
export function getSubmittedAssignments(project) {
    return getAcceptedAssignments(project).filter((a) => ["Submitted", "Under Review", "Completed", "Not Completed"].includes(a.workStatus ?? ""));
}
export function getEvaluableAssignments(project) {
    return getAcceptedAssignments(project).filter((a) => ["Submitted", "Under Review", "Completed", "Not Completed"].includes(a.workStatus ?? ""));
}
export function getPurchasableAssignments(project) {
    return getAcceptedAssignments(project).filter((a) => a.completionStatus === "Completed");
}
export function getAssignmentForDeveloper(project, developerId = CURRENT_DEVELOPER_ID) {
    return getAssignments(project).find((a) => a.developerId === developerId);
}
export function isAwaitingInvite(assignment) {
    return assignment.invitationStatus === "Matched";
}
export function isInvitationPending(assignment) {
    return (assignment.invitationStatus === "Invited" ||
        assignment.invitationStatus === "Pending Response");
}
export function assignmentDisplayStatus(assignment) {
    if (assignment.invitationStatus === "Matched")
        return "Matched";
    if (assignment.invitationStatus === "Declined")
        return "Declined";
    if (isInvitationPending(assignment))
        return "Invited";
    return assignment.workStatus ?? assignment.invitationStatus;
}
export function developerListTab(assignment) {
    if (!assignment)
        return null;
    if (assignment.invitationStatus === "Matched")
        return null;
    if (assignment.invitationStatus === "Declined")
        return "invitations";
    if (assignment.invitationStatus === "Invited" || assignment.invitationStatus === "Pending Response") {
        return "invitations";
    }
    switch (assignment.workStatus) {
        case "Accepted":
        case "In Progress":
            return "active";
        case "Submitted":
        case "Under Review":
            return "submitted";
        case "Completed":
            return "completed";
        case "Not Completed":
            return "not-completed";
        default:
            return "active";
    }
}
export function findProject(projects, id) {
    return projects.find((p) => p.id === id);
}
export function submissionsForProject(project, allSubmissions) {
    const acceptedIds = new Set(getAcceptedAssignments(project).map((a) => a.developerId));
    return allSubmissions.filter((s) => s.assignmentId.startsWith(project.id) || acceptedIds.has(s.developerId));
}
