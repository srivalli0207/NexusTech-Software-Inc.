
interface UserProfile {
    username: string;
    email: string;
    password: string;
    displayName?: string;
    pronouns?: string;
    bio?: string;
    profilePicture?: string;
    banner?: string;
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
 
    setDisplayName(displayName: string): UserProfileBuilder {
      this.userProfile.displayName = displayName;
      return this;
    }

    setPronouns(pronouns: string): UserProfileBuilder {
      this.userProfile.pronouns = pronouns;
      return this;
    }

    setBio(bio: string): UserProfileBuilder {
      this.userProfile.bio = bio;
      return this;
    }

    setProfilePicture(profilePicture: string): UserProfileBuilder {
      this.userProfile.profilePicture = profilePicture;
      return this;
    }

    setBanner(banner: string): UserProfileBuilder {
      this.userProfile.banner = banner;
      return this;
    }
 
    build(): UserProfile {
       if (!this.userProfile.username || !this.userProfile.email || !this.userProfile.password) {
          throw new Error("Missing required fields");
       }
       return this.userProfile as UserProfile;
    }
 }
 
 export default UserProfileBuilder;
 