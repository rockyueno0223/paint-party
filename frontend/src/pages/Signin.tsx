import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IFormData } from "@/types/formData";

export const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setErrorMessage(null);
      const res = await fetch('/api/users/signin', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen mt-20 flex p-3 max-w-2xl mx-auto justify-center">
      <div className="flex-1">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <Label value="Your email" />
            <TextInput
              type="email"
              placeholder="name@mail.com"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Your password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500"
          >
            Sign In
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Don't have an account?</span>
          <Link to='/signup' className="text-blue-500">
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  )
}
