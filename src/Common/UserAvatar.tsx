import React, { useState } from 'react';

const COLORS = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff',
    '#52c41a', '#f5222d', '#eb2f96', '#2f54eb', '#722ed1'
];

interface UserAvatarProps {
    user: any;
    className?: string;
    size?: number | string; // 'sm', 'md', 'lg' or number
}

const getRandomColor = (name: string) => {
    if (!name) return COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % COLORS.length);
    return COLORS[index];
};

const getInitials = (user: any) => {
    if (!user) return 'U';

    // Try firstName + lastName
    if (user.firstName && user.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    // Try name (full name)
    if (user.name) {
        const parts = user.name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        }
        return user.name.charAt(0).toUpperCase();
    }

    // Try userName
    if (user.userName) {
        return user.userName.charAt(0).toUpperCase();
    }

    return 'U';
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, className = "", size = "md" }) => {
    const [imgError, setImgError] = useState(false);

    const espoUrl = process.env.REACT_APP_ESPOCRM_URL;
    const avatarId = user?.avatarId;
    const name = user?.name || user?.userName || "User";

    // Image URL
    const imageUrl = (avatarId && !imgError)
        ? `${espoUrl}/?entryPoint=WebAsset&id=${avatarId}&size=small`
        : null;

    const bgColor = getRandomColor(name);
    const initials = getInitials(user);

    // Calculate dimensions if size is number
    const dimension = typeof size === 'number' ? size : undefined;
    const fontSize = typeof size === 'number' ? size * 0.4 : undefined;

    return (
        <div
            className={`${className} rounded-circle position-relative overflow-hidden d-flex align-items-center justify-content-center text-white`}
            style={{
                backgroundColor: bgColor,
                width: dimension || '100%',
                height: dimension || '100%',
                minWidth: dimension || '100%',
                minHeight: dimension || '100%',
                fontSize: fontSize,
                fontWeight: 'bold'
            }}
        >
            {/* 1. Initials (Always rendered as background) */}
            <span>{initials}</span>

            {/* 2. Image (Overlay on top) - only if available and no error */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={name}
                    className="rounded-circle position-absolute w-100 h-100 start-0 top-0"
                    style={{ objectFit: 'cover' }}
                    onError={() => setImgError(true)}
                />
            )}
        </div>
    );
};

export default UserAvatar;
