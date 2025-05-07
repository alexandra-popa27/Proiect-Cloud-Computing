import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Registration failed.");
        return;
      }

      alert("Account created successfully! You can now log in.");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default RegisterPage;