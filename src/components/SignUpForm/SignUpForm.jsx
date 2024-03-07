import { Component } from "react";
import { createUserProfile } from '../../utilities/users-service';

export default class SignUpForm extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        zipcode: '', // Added zipcode to state to match the user schema
        error: ''
    };

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
            error: ''
        });
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        const { name, email, password, confirm, zipcode } = this.state;

        if (password !== confirm) {
            this.setState({ error: 'Passwords do not match' });
            return;
        }

        try {
            const formData = { name, email, password, zipcode }; // Updated to include zipcode
            const user = await createUserProfile(formData); // Using createUserProfile to sign up
            this.props.setUser(user); // Assuming setUser updates the user context or state in your application
        } catch (error) {
            console.error('Sign Up Failed:', error);
            this.setState({ error: 'Sign Up Failed - Try Again' });
        }
    };

    render() {
        const { name, email, password, confirm, zipcode, error } = this.state;
        const disable = password !== confirm || !zipcode;

        return (
            <div>
                <div className="form-container">
                    <form autoComplete="off" onSubmit={this.handleSubmit}>
                        <label>Name</label>
                        <input type="text" name="name" value={name} onChange={this.handleChange} required />
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={this.handleChange} required />
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={this.handleChange} required />
                        <label>Confirm Password</label>
                        <input type="password" name="confirm" value={confirm} onChange={this.handleChange} required />
                        <label>Zipcode</label>
                        <input type="number" name="zipcode" value={zipcode} onChange={this.handleChange} required /> {/* Input type changed to number */}
                        <button type="submit" disabled={disable}>SIGN UP</button>
                    </form>
                </div>
                <p className="error-message">&nbsp;{error}</p>
            </div>
        );
    }
}
