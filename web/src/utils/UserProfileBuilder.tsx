
interface UserProfile {
    username: string;
    email: string;
    password: string;
    // Any other fields but I'm keeping it the same for now
 }
 // Builder pattern class allowing profile building with step-by-step construction
 class UserProfileBuilder {
    private userProfile: Partial<UserProfile> = {};
 
    setUsername(username: string): UserProfileBuilder {
       this.userProfile.username = username;
       return this;
    }
 
    setEmail(email: string): UserProfileBuilder {
       this.userProfile.email = email;
       return this;
    }
 
    setPassword(password: string): UserProfileBuilder {
       this.userProfile.password = password;
       return this;
    }
 
    // Can add other methods if we decide to put optional fields in create account
 
    build(): UserProfile {
       if (!this.userProfile.username || !this.userProfile.email || !this.userProfile.password) {
          throw new Error("Missing required fields");
       }
       return this.userProfile as UserProfile;
    }
 }
 
 export default UserProfileBuilder;
 