import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import Logo from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthContext from '../../hooks/AuthContext';
import ToastContext from '../../hooks/ToastContext';
import { mapValidationErrorToErrorObject } from '../../utils/errorObjectMapper';
import { Background, Container, Content } from './styles';

interface LoginInputData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = AuthContext.useAuth();
  const { addToast } = ToastContext.useToast();
  const handleSubmit = useCallback(
    async (data: LoginInputData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha é obrigatória'),
        });
        await schema.validate(data, { abortEarly: false });
        await signIn(data.email, data.password);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(mapValidationErrorToErrorObject(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao fazer login',
          description: 'Verifique se o email ou senha estão corretos',
        });
      }
    },
    [signIn, addToast],
  );

  return (
    <Container>
      <Content>
        <img src={Logo} alt="GoBarber logo" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
            autoComplete="on"
          />
          <Button type="submit">Entrar</Button>
          <Link to="forgot-password">Esqueci minha senha</Link>
        </Form>
        <Link to="/signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default Login;
