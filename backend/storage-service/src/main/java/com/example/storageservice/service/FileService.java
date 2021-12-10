package com.example.storageservice.service;

import io.minio.*;
import io.minio.messages.Item;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {
    private MinioClient minioClient;
    private final String endPoint = "http://127.0.0.1:9000";
    private final String accessKey = "admin";
    private final String storageAccountKey = "yumatchadmin";
    private final String bucketName = "meal-images";

    @PostConstruct
    public void init() {
        minioClient = MinioClient.builder().endpoint(endPoint)
                .credentials(accessKey, storageAccountKey).build();
        createBucket();
    }

    public List<String> getAll() {
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(ListObjectsArgs.builder().bucket(bucketName).build());

            List<String> list = new ArrayList<>();
            for (Result<Item> result : results) {
                Item item = result.get();
                list.add(item.objectName());
            }
            return list;
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
        return null;
    }

    public InputStream getFile(String fileName) {
        try {
            return minioClient.getObject(GetObjectArgs.builder().bucket(bucketName).object(fileName).build());
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
        return null;
    }

    public boolean uploadFile(String fileName, MultipartFile file) {
        try {
            if (doesFileExist(fileName)) {
                return false;
            }

            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName).object(fileName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType()).build());
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            return false;
        }
        return true;
    }

    public boolean updateFile(String fileName, MultipartFile file) {
        if (!doesFileExist(fileName)) return false;
        try {
            minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucketName).object(fileName).build());
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName).object(fileName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType()).build());
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            return false;
        }
        return true;
    }

    public boolean deleteFile(String fileName) {
        if (!doesFileExist(fileName)) return false;
        try {
            minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucketName).object(fileName).build());
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            return false;
        }
        return true;
    }

    private void createBucket() {
        try {
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists) {
                this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                System.out.println("Created Bucket: " + bucketName);
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
    }

    private boolean doesFileExist(String fileName) {
        try {
            InputStream fileNameExists = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName).build());
            return fileNameExists != null;
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
        return false;
    }
}
