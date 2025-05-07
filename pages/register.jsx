import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    console.log("This will send data to backend later:", formData);
    // Here we will add validation and backend request
  };

  const handleCancel = () => {
    router.push("/");
  };

  return <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default RegisterPage;