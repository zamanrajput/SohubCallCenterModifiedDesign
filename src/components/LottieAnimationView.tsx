import Lottie from "lottie-react";


type LottieAnimationType = {
    animationData: any,
    width: number,
    height: number
}
export default function LottieAnimationView(props: LottieAnimationType) {
    const defaultOptions = {

        loop: true,
        autoplay: true,
        animationData: props.animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },

    };

    return (
        <div >
            <Lottie
    
                loop={true}
                animationData={props.animationData}
                height={props.height}
                width={props.width}
            />
        </div>

    );
}
