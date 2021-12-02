package com.example.storageservice.controller;

import com.example.storageservice.service.FileService;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.List;

@RestController
@RequestMapping("api/storage")
public class FileController {

    @Autowired
    private FileService fileService;

     @GetMapping
     public List<String> getAll()  {
         try {
             return fileService.getAll();
         } catch(Exception error) {
             System.out.println("Error: " + error);
         }
         return null;
     }

    @GetMapping(path = "/")
    public void getFile(@RequestParam String fileName, HttpServletResponse response)  {
        InputStream loadedFile = fileService.getFile(fileName);
        if (loadedFile != null) {
            try {
                response.setContentType(URLConnection.guessContentTypeFromStream(loadedFile));
                IOUtils.copy(loadedFile, response.getOutputStream());
            } catch (IOException exception) {
                System.out.println("Exception: " + exception);
            }
        }
    }

     @PostMapping
     public ResponseEntity<Object> uploadFile(@RequestPart String fileName, @RequestPart MultipartFile file) {
        if (fileService.uploadFile(fileName, file))
            return ResponseEntity.status(HttpStatus.CREATED).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
     }

     @PutMapping
     public ResponseEntity<Object> updateFile(@RequestPart String fileName, @RequestPart MultipartFile file) {
         if (fileService.updateFile(fileName, file))
             return ResponseEntity.status(HttpStatus.CREATED).build();
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
     }

     @DeleteMapping(path = "/")
     public ResponseEntity<Object> deleteFile(@RequestParam String fileName) {
         if (fileService.deleteFile(fileName))
             return ResponseEntity.status(HttpStatus.OK).build();
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
     }
}