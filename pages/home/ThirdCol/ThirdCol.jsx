
import SecondSection from './SecondSection';

import DetailedInCallLayout from './DetailedInCallPanel';
const ThirdCol = () => {
    return (
        <div>
            <DetailedInCallLayout/>
  

            {/* 2nd section  */}
            <section>
                <SecondSection></SecondSection>
            </section>
        </div>
    );
};

export default ThirdCol;