// export const checkAccess = (requiredPermission = null, allowedRoles = []) => {
//     // 1. LocalStorage से डेटा निकालें
//     const user = JSON.parse(localStorage.getItem('user'));
//     const role = user?.role || null;
//     const permissions = user?.permissions || [];

//     // 2. Super Admin को हमेशा सब कुछ करने की अनुमति दें
//     if (role === 'super_admin') return true;

//     // 3. अगर सिर्फ रोल के आधार पर चेक करना हो (जैसे Admin या Customer)
//     if (allowedRoles.length > 0 && allowedRoles.includes(role)) {
//         return true;
//     }

//     // 4. अगर परमिशन के आधार पर चेक करना हो (जैसे 'edit_room')
//     if (requiredPermission && permissions.includes(requiredPermission)) {
//         return true;
//     }

//     // अगर कुछ मैच नहीं हुआ तो मना कर दो
//     return false;
// };



















// Permission object jo backend se aa raha hai
interface Permission {
    model_name: string;   // e.g. "Hotel"
    permission: string;   // e.g. "r", "w", "d"
}

// User structure
interface User {
    role?: string | null; // null = SuperAdmin
    permissions?: Permission[];
}

/**
 * Access checker
 * @param requiredPermission e.g. "Hotel:r"
 * @param allowedRoles e.g. ["Admin", "Staff"]
 */
export const checkAccess = (
    requiredPermission: string | null = null,
    allowedRoles: string[] = []
): boolean => {

    const userStr = localStorage.getItem("user");
    let user: User | null = null;

    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (err) {
        console.error("Invalid user data in localStorage", err);
        return false;
    }

    const role = user?.role ?? null;
    const permissions = user?.permissions ?? [];

    // 1️⃣ SuperAdmin (role === null) → full access
    if (role === null) {
        return true;
    }

    // 2️⃣ Role based access
    if (allowedRoles.length > 0 && role && allowedRoles.includes(role)) {
        return true;
    }

    // 3️⃣ Permission based access (backend object support)
    if (requiredPermission) {
        const [modelName, perm] = requiredPermission.split(":");

        return permissions.some(
            (p) =>
                p.model_name === modelName &&
                p.permission === perm
        );
    }

    // ❌ No access
    return false;
};
