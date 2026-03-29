#!/bin/bash
gcloud compute ssh cryosphere \
    --zone=us-east1-d \
    --tunnel-through-iap \
    -- -L 9000:localhost:9000 -N  &
gcloud compute ssh cryosphere \
    --zone=us-east1-d \
    --tunnel-through-iap \
    -- -L 8123:localhost:8123 -N  &