import { useState } from 'react';
import { createUserProfile } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

export default function SignUpForm() {
    const { setUser } = useUser();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        zipcode: '',
        error: ''
    });
    const navigate = useNavigate();

    const handleChange = (evt) => {
        setFormState({ ...formState, [evt.target.name]: evt.target.value, error: '' });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (formState.password !== formState.confirm) {
            setFormState({ ...formState, error: 'Passwords do not match' });
            return;
        }
        
        try {
            const { name, email, password, zipcode } = formState;
            const formData = { name, email, password, zipcode };
            const user = await createUserProfile(formData);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user)); // Optionally save user data or token
            navigate('/profile'); // Redirect to profile
        } catch (error) {
            console.error('Sign Up Failed:', error);
            setFormState({ ...formState, error: 'Sign Up Failed - Try Again' });
        }
    };

    const disable = formState.password !== formState.confirm || !formState.name || !formState.email || !formState.password || !formState.zipcode;

    return (
        <div>
            <div className="form-container">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={formState.name} onChange={handleChange} required />
                    <label>Email</label>
                    <input type="email" name="email" value={formState.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input type="password" name="password" value={formState.password} onChange={handleChange} required />
                    <label>Confirm Password</label>
                    <input type="password" name="confirm" value={formState.confirm} onChange={handleChange} required />
                    <label>Zipcode</label>
                    <input type="number" name="zipcode" value={formState.zipcode} onChange={handleChange} required />
                    <button type="submit" disabled={disable}>SIGN UP</button>
                </form>
            </div>
            <p className="error-message">&nbsp;{formState.error}</p>
        </div>
    );
}
