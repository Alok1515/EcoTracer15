package com.carbontracker.controller;

import com.carbontracker.dto.LcaRequest;
import com.carbontracker.dto.LcaResponse;
import com.carbontracker.service.LcaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lca")
@CrossOrigin(origins = "*")
public class LcaController {

    private final LcaService lcaService;

    public LcaController(LcaService lcaService) {
        this.lcaService = lcaService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<LcaResponse> calculateLca(@RequestBody LcaRequest request) {
        return ResponseEntity.ok(lcaService.calculateEmissions(request));
    }
}
