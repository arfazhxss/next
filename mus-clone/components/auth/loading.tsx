import Image from "next/image"

export const Loading = () => {
    return (
        <main className="flex w-full h-full items-center justify-center bg-white">
            <Image 
            src={"/loading.svg"}
            alt="Loading"
            width={200}
            height={200}
            />
        </main>
    )
}