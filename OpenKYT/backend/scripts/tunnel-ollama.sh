#!/bin/bash
gcloud compute ssh glacier \
    --zone=us-east1-d \
    --tunnel-through-iap \
    -- -L 11434:localhost:11434 -N  &