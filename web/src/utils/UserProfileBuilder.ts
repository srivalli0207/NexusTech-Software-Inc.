// UserProfileBuilder.ts
interface UserProfile {
    username: string;
    email: string;
    password: string;
    // Additional fields can be added here as optional
 }
 
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
 
    // Add methods for any additional optional fields as needed
 
    build(): UserProfile {
       if (!this.userProfile.username || !this.userProfile.email || !this.userProfile.password) {
          throw new Error("Missing required fields");
       }
       return this.userProfile as UserProfile;
    }
 }
 
 export default UserProfileBuilder;
 