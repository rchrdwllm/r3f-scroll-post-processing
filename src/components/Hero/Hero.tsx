import style from "./Hero.module.scss";

const Hero = () => {
    return (
        <div className={style.hero}>
            <div>
                <h1>
                    Hello, <br />
                    world!
                </h1>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Vel esse cupiditate a, ullam quis dignissimos, obcaecati
                    amet corporis ad repudiandae aliquam blanditiis nulla,
                    libero fuga?
                </p>
            </div>
            <h1>Flawless</h1>
        </div>
    );
};

export default Hero;
