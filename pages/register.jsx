import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    console.log("Trimite datele spre API (de implementat)", formData);
    // În viitor: validări + POST spre backend
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />
  );
};

export default RegisterPage;