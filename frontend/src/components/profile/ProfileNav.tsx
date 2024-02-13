import React from 'react'

interface Props {
    page: "profile" | "stats"
}

const ProfileNav: React.FC<Props> = ({ page }) => {

    return (
        <div className="flex flex-col gap-3">
            <a href="/profile/" className={`p-2 px-4 cursor-pointer hover:bg-accent rounded-md ${page === "profile" ? "bg-accent" : ""}`}>
                Profile
            </a>
            <a href="/profile/stats" className={`p-2 px-4 cursor-pointer hover:bg-accent rounded-md ${page === "stats" ? "bg-accent" : ""}`}>
                Stats
            </a>
        </div>
    )
}

export default ProfileNav