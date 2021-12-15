import java.util.*;
import java.io.*;
import java.nio.file.*;
import java.nio.file.Files;
import java.security.*;


class ComputeSHA {

    private byte[] digest;

    public ComputeSHA(String data) throws NoSuchAlgorithmException {
        
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(data.getBytes());

        digest = messageDigest.digest();
    }

    public StringBuilder converHexStr() {
        
        StringBuilder hexStr = new StringBuilder();
        for (int i = 0; i < digest.length; i++) {
            hexStr.append(String.format("%02x", 0xFF & digest[i]));
        }
        return hexStr;
    }

    public void printDigest(StringBuilder hexStr) {
        System.out.println(hexStr.toString());
    }
    
    public static void main(String[] args) throws IOException {

        // Check whether User enter the name of file or not.
        if (args.length != 1) {
            System.out.println("You have to enter the name of one input file.");
            return;
        }

        // Read the contents of file to String.
        String message = "";
        try {
            message = new String (Files.readAllBytes(Paths.get(args[0])));
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        // Generate a message digest and prints it.
        try {
            ComputeSHA ComSHA = new ComputeSHA(message);
            // Converting the byte array into HexString format.
            StringBuilder hexStr = ComSHA.converHexStr();
            // Print the computed message
            ComSHA.printDigest(hexStr);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }                
    }
}