import AstroJS from "@/images/astrojs.png"
import NodeJS from "@/images/nodejs.png"
import Prisma from "@/images/prisma.png"
import ReactJS from "@/images/react.png"
import TypeScript from "@/images/ts.png"


const Scroller = () => {
    const icons = [AstroJS.src, NodeJS.src, Prisma.src, ReactJS.src, TypeScript.src]
    return (
        <section className="flex gap-12 items-center w-full overflow-hidden mt-12 py-6 relative mb-16">
            <div className="flex gap-12 absolute scroller">
                {icons.concat(icons).map((icon, i) => (
                    <img key={`${icon}(${i})`} src={icon} className="max-h-[3.5rem]" />
                ))}
            </div>
        </section>
    )
}

export default Scroller