import { account, appwriteConfig, database } from "./client";
import { OAuthProvider, Query } from 'appwrite';
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try{
        account.createOAuth2Session(
            OAuthProvider.Google);

    }catch (e){
        console.log('Error logging in with Google:', e);
    }
}

export const logoutUser = async () => {
    try{

    }catch (e){
        console.log(e);
    }
}
export const getUser = async () => {
    try{
        const user = await account.get();

        if(!user) return redirect('/sign-in');

        const { documents } = await database.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId, 
            [
                Query.equal('accountId',user.$id),
                Query.select(['name','email','imageUrl','joinedAt','accountId'])
            ]
        )
    }catch (e){
        console.log(e);
    }
}
export const getGooglePicture = async () => {
    try{
        
    }catch (e){
        console.log(e);
    }
}

export const storeUserData = async () => {
    try{

    }catch (e){
        console.log(e);
    }
}

export const getExisitingUser = async () => {
    try{

    }catch (e){
        console.log(e);
    }
}