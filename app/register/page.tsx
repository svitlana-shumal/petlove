import Container from '@/components/Container/Container';
import PetBlock from '@/components/PetBlock/PetBlock';
import RegistrationForm from '@/components/RegistrationForm/RegistrationForm';
// import Title from '@/components/Title/Title';
import css from './Register.module.css';

export default function Registration() {
  return (
    <Container>
      <section className={css.page}>
        <PetBlock
          alt="Happy cat"
          images={{
            mobile: '/register/cat-mobile.webp',
            tablet: '/register/cat-tablet.webp',
            desktop: '/register/cat-desktop.webp',
          }}
        />
        {/* <Title text="Registration" /> */}
        <RegistrationForm />
      </section>
    </Container>
  );
}
