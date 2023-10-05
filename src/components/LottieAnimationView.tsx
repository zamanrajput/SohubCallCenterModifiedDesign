
import Lottie, { Options } from 'react-lottie';

type LottieAnimationType = {
    animationData: any,
    width: number,
    height: number
}
export default function LottieAnimationView(props: LottieAnimationType) {
    const defaultOptions: Options = {

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
                style={{ background: '#RRGGBBAA', borderRadius: '10px'}}
                isClickToPauseDisabled={true}

                options={defaultOptions}
                height={props.height}
                width={props.width}
            />
        </div>

    );
}
